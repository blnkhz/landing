import { useEffect, useState } from 'react'
import gradientGL from 'gradient-gl'
import './App.css'
import ContactModal from './components/Contact'
import { generateRandomBackground } from './utils/helpers'

function App() {
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    gradientGL(generateRandomBackground())
  }, [])

  return (
    <div className="p-4 md:p-8 lg:p-12">
      <div className="box bg-rose-50 border-2 border-black shadow-[0_10px_0_black] rounded-[1rem] w-full max-w-md p-4 md:p-8 lg:p-12 transition-all duration-500 ease-in-out tracking-wide">
        <h1 className="text-xl md:text-3xl font-bold">blnkhz</h1>
        <p className="text-sm md:text-base">blanka hooz</p>
        <p className="text-sm md:text-base">software engineer 👩🏻‍💻</p>
        <p className="text-sm md:text-base">los angeles, ca 🌴</p>
        <p
          onClick={() => setExpanded((prev) => !prev)}
          className="underline cursor-pointer transition-color hover:text-rose-500 duration-200 mb-2"
        >
          {expanded ? 'less' : 'more'}
        </p>
        <div
          className={`transition-all duration-500 ease-in-out ${
            expanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden`}
        >
          <div className="about-expanded text-sm md:text-base mb-2">
            <p>
              hi, i'm blanka, a software engineer with 5+ years of experience.
              i've been the enterprise engineer navigating the meeting maze and
              the startup engineer sprinting through chaos — and somehow enjoyed
              both. i'd define myself as full-stack but secretly enjoy working
              on the ui more. <span className="italic">shhh.</span>
              <br />
              current side project: building{' '}
              <a
                href="https://blnkhz.github.io/plotter-tools"
                target="_blank"
                className="underline cursor-pointer transition-colors hover:text-rose-500 duration-200"
              >
                pen plotter tools
              </a>
            </p>
            <nav className="flex flex-col mt-2">
              <a
                href="/blanka-hooz-resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="underline cursor-pointer transition-colors hover:text-rose-500 duration-200"
              >
                resume
              </a>
              <a
                href="https://www.linkedin.com/in/blnkhz/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline cursor-pointer transition-colors hover:text-rose-500 duration-200 mb-2"
              >
                linkedin
              </a>
            </nav>
          </div>
        </div>

        <ContactModal />
      </div>
    </div>
  )
}

export default App
