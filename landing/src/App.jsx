import MeshGradient from './components/MeshGradient'
import StatusBar from './components/StatusBar'
import Hero from './components/Hero'
import About from './components/About'
import Marquee from './components/Marquee'
import Experience from './components/Experience'
import RuleSection from './components/RuleSection'
import Toolkit from './components/Toolkit'
import SayHi from './components/SayHi'
import Footer from './components/Footer'
import GliderCursor from './components/GliderCursor'
import { sections } from './content'

export default function App() {
  return (
    <>
      <MeshGradient />
      <StatusBar />
      <main id="top">
        <Hero />
        <About />
        <Marquee />
        {sections.experience && <Experience />}
        <Toolkit />
        <RuleSection />
        <SayHi />
        <Footer />
      </main>
      <GliderCursor />
    </>
  )
}
