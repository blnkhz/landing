import { useEffect, useState } from 'react'
import gradientGL from 'gradient-gl'
import './App.css'
import IntroCard from './components/IntroCard'
import { generateRandomBackground } from './utils/helpers'
import { ContactModal } from './components/Contact'

function App() {
  const [showContact, setShowContact] = useState(false)
  useEffect(() => {
    gradientGL(generateRandomBackground())
  }, [])

  return (
    <div className="relative w-screen h-screen overflow-hidden p-2 sm:p-4">
      <IntroCard onOpenModal={() => setShowContact(true)} onClose={() => {}} />
      {showContact && <ContactModal onClose={() => setShowContact(false)} />}
    </div>
  )
}

export default App
