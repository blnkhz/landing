import { useRef, useState } from 'react'
import Draggable from 'react-draggable'

export default function Window({
  title,
  children,
  onClose,
  startMinimized = false,
  hideCancel = false,
  defaultPosition = { x: 0, y: 24 },
}) {
  const [minimized, setMinimized] = useState(startMinimized)
  const nodeRef = useRef(null)

  const handleMinimize = () => setMinimized((prev) => !prev)

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".drag-handle"
      bounds="parent"
      cancel="button, a"
      defaultPosition={defaultPosition}
    >
      <div
        ref={nodeRef}
        className="absolute w-full max-w-[min(90vw,400px)] max-h-[calc(100vh-24px)] overflow-hidden bg-white border-2 border-black shadow-[10px_10px_0_black] rounded-[1rem] transition-all duration-500 ease-in-out tracking-wide"
      >
        <div
          className={`drag-handle cursor-move flex items-center justify-between bg-rose-300 text-white px-4 py-1 ${
            minimized ? '' : 'border-b-2'
          } border-black rounded-t-[0.9rem] select-none touch-none`}
        >
          <span className="font-bold text-black">{title}</span>
          <div className="flex space-x-1">
            <button
              onClick={handleMinimize}
              className="w-3 h-3 bg-yellow-400 border border-black"
              aria-label="Minimize"
            />
            {!hideCancel && (
              <button
                onClick={onClose}
                className="w-3 h-3 bg-red-600 border border-black"
                aria-label="Close"
              />
            )}
          </div>
        </div>
        <div
          className={`transition-all duration-300 ease-in-out ${
            minimized ? 'max-h-0 opacity-0' : 'p-4 opacity-100'
          } overflow-auto`}
        >
          {children}
        </div>
      </div>
    </Draggable>
  )
}
