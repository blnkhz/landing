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
      <div className="box bg-rose-50 border-2 border-black shadow-[0_10px_0_black] rounded-[1rem] w-full max-w-md p-4 md:p-8 lg:p-12 transition-all duration-500 ease-in-out">
        <h1 className="text-xl md:text-3xl font-bold">blnkhz</h1>
        <p className="text-sm md:text-base">[tbd]</p>
        <p
          onClick={() => setExpanded((prev) => !prev)}
          className="cursor-pointer underline mb-2"
        >
          {expanded ? 'show less' : 'who?'}
        </p>
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            expanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <p className="text-sm md:text-base text-gray-700 mb-2">
            [insert txt here]
          </p>
        </div>

        <ContactModal />
      </div>
    </div>
  )
}

export default App
