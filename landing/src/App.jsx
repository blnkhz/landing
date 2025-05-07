import gradientGL from 'gradient-gl'
import { useEffect } from 'react'
import './App.css'
import ContactModal from './components/Contact'
import { generateRandomBackground } from './utils/helpers'

function App() {
  useEffect(() => {
    gradientGL(generateRandomBackground())
  }, [])

  return (
    <div className="p-4 md:p-8 lg:p-12">
      <div className="box bg-rose-50 border-2 border-black shadow-[0_10px_0_black] rounded-[1rem] w-full max-w-md p-4 md:p-8 lg:p-12">
        <h1 className="text-xl md:text-3xl font-bold">blnkhz</h1>
        <p className="text-sm md:text-base mb-2">[tbd]</p>
        <ContactModal />
      </div>
    </div>
  )
}

export default App
