import { REDUCED } from './life'

const VERTEX = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}'

// Pastel mesh (five drifting colour points) under a thin-film "holographic" layer.
// The pointer tilts the film like a foil card under a light; scroll shifts palettes.
const FRAGMENT = `precision highp float;
uniform vec2 uRes;uniform float uTime;uniform float uScroll;uniform vec2 uTilt;
uniform vec3 uA[5];uniform vec3 uB[5];
float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p=p*2.03+17.1;a*=.5;}return v;}
vec3 film(float x){return .5+.5*cos(6.28318*(x+vec3(0.,.33,.67)));}
void main(){
 vec2 uv=gl_FragCoord.xy/uRes; float asp=uRes.x/uRes.y;
 vec2 p=vec2(uv.x*asp,uv.y);
 float t=uTime*.04;
 vec2 q=p+.25*vec2(fbm(p*1.3+vec2(t,-t)+uScroll*2.),fbm(p*1.3-vec2(t*.8,t)+4.+uScroll))-.12;
 vec3 col=vec3(0.);float ws=0.;
 float k=smoothstep(.0,1.,uScroll);
 for(int i=0;i<5;i++){
  float fi=float(i);
  vec2 c=vec2(.5*asp,.5)+vec2(sin(t*1.3+fi*1.9+uScroll*4.)*.55*asp,cos(t*1.1+fi*2.6-uScroll*3.)*.48);
  float d=distance(q,c);
  float w=1./pow(d*d+.03,1.5);
  col+=mix(uA[i],uB[i],k)*w; ws+=w;
 }
 col/=ws;
 float th=fbm(q*2.2+uTilt*1.5+t*.6)*1.4+dot(p,vec2(.35,.55))+uScroll*.8+dot(uTilt,vec2(.6,-.4));
 vec3 irid=mix(film(th),vec3(1.),.5);
 float band=smoothstep(.15,.85,fbm(q*1.6-t*.5+uTilt));
 col=mix(col,col*.55+irid*.55,.45+.25*band);
 float streak=sin((p.x*.8+p.y)*140.+fbm(p*6.)*14.)*.5+.5;
 col+=irid*streak*.035;
 float sheen=exp(-pow((p.x*.7-p.y+.2-uTilt.x*.6-sin(t*1.7)*.4+uScroll*1.5),2.)*9.);
 col+=vec3(1.)*sheen*.09;
 col=clamp(col,0.,1.);
 float g=hash(floor(gl_FragCoord.xy)+fract(uTime*7.)*91.);
 col+=(g-.5)*.03;
 gl_FragColor=vec4(col,1.);
}`

// hero palette, then a cooler opal palette for the lower page
const PALETTE_A = ['#ffc8ea', '#c9f5e4', '#d6c4ff', '#ffe3c8', '#bfe0ff']
const PALETTE_B = ['#c4c9ff', '#b9f1ef', '#f2c6ff', '#fff2bf', '#dff0ff']
const SCALE = 0.6

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)

export function createMesh(canvas) {
  const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false })
  if (!gl) return null
  const shader = (type, src) => {
    const s = gl.createShader(type)
    gl.shaderSource(s, src)
    gl.compileShader(s)
    return s
  }
  const program = gl.createProgram()
  gl.attachShader(program, shader(gl.VERTEX_SHADER, VERTEX))
  gl.attachShader(program, shader(gl.FRAGMENT_SHADER, FRAGMENT))
  gl.linkProgram(program)
  // With this extension the compile runs off the main thread; we poll each frame
  // and start drawing once it's done. Without it, the first status check blocks.
  const parallel = gl.getExtension('KHR_parallel_shader_compile')
  let u = null

  function setup() {
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      canvas.hidden = true // the body's CSS gradient shows instead
      return false
    }
    gl.useProgram(program)
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(program, 'p')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    const at = (n) => gl.getUniformLocation(program, n)
    u = { res: at('uRes'), time: at('uTime'), scroll: at('uScroll'), tilt: at('uTilt') }
    gl.uniform3fv(at('uA'), new Float32Array(PALETTE_A.flatMap(hex)))
    gl.uniform3fv(at('uB'), new Float32Array(PALETTE_B.flatMap(hex)))
    size(true)
    return true
  }

  // `force` matters on a re-mount (React StrictMode): the canvas already has the
  // right size, but this new program has never been told its resolution.
  function size(force) {
    if (!u) return
    const w = Math.max(1, Math.round(innerWidth * SCALE))
    const h = Math.max(1, Math.round(innerHeight * SCALE))
    if (force === true || canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
      gl.viewport(0, 0, w, h)
      gl.uniform2f(u.res, w, h)
    }
  }
  let tx = 0
  let ty = 0
  let tiltX = 0
  let tiltY = 0
  const onPointer = (e) => {
    tx = e.clientX / innerWidth - 0.5
    ty = e.clientY / innerHeight - 0.5
  }
  if (!parallel && !setup()) return null
  addEventListener('resize', size)
  addEventListener('pointermove', onPointer)

  let lastScroll = -1
  return {
    frame(now, scroll) {
      if (!u) {
        if (canvas.hidden || !gl.getProgramParameter(program, parallel.COMPLETION_STATUS_KHR)) return
        if (!setup()) return
      }
      if (REDUCED && Math.abs(scroll - lastScroll) < 0.002) return
      lastScroll = scroll
      gl.uniform1f(u.time, REDUCED ? 12 : now / 1000 + 12)
      gl.uniform1f(u.scroll, scroll)
      tiltX += (tx - tiltX) * 0.05
      tiltY += (ty - tiltY) * 0.05
      gl.uniform2f(u.tilt, REDUCED ? 0 : tiltX, REDUCED ? 0 : tiltY)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    },
    destroy() {
      removeEventListener('resize', size)
      removeEventListener('pointermove', onPointer)
    },
  }
}
