import { useState } from 'react'
import Window from './Window'
import { Button } from './Button'

export default function IntroCard({ onOpenModal, onClose }) {
  const [isExpanded, setIsExpanded] = useState(false)
  return (
    <Window title="blnkhz" onClose={onClose} hideCancel>
      <p className="text-sm md:text-base">blanka hooz</p>
      <p className="text-sm md:text-base">software engineer 👩🏻‍💻</p>
      <p className="text-sm md:text-base">los angeles, ca 🌴</p>
      <p
        className="underline cursor-pointer hover:text-rose-500 mb-2"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? 'less' : 'more'}
      </p>
      {isExpanded ? (
        <div>
          <p className="text-sm md:text-base">
            hi, i'm blanka, a software engineer with 5+ years of experience.
            i've been the enterprise engineer navigating the meeting maze and
            the startup engineer sprinting through chaos — and somehow enjoyed
            both. i'd define myself as full-stack but secretly enjoy working on
            the ui more. <span className="italic">shhh.</span>
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
              className="underline hover:text-rose-500"
            >
              resume
            </a>
            <a
              href="https://www.linkedin.com/in/blnkhz/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-rose-500 mb-2"
            >
              linkedin
            </a>
          </nav>
        </div>
      ) : null}
      <Button onClick={onOpenModal} text="say hi" />
    </Window>
  )
}
