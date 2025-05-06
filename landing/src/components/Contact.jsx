import { useState } from 'react'
import { submitToGoogleForms } from '../utils/helpers'

export default function ContactModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const openModal = () => {
    setIsOpen(true)
    setTimeout(() => setIsVisible(true), 10)
  }

  const closeModal = () => {
    setIsVisible(false)
    setTimeout(() => setIsOpen(false), 200)
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await submitToGoogleForms(form)
    setForm({ name: '', email: '', message: '' })
    closeModal()
  }

  return (
    <>
      <button
        onClick={openModal}
        className="px-4 py-2 bg-rose-500 text-white rounded hover:bg-black"
      >
        say hi
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className={`absolute inset-0 bg-black transition-opacity duration-200 ${
              isVisible ? 'opacity-50' : 'opacity-0'
            }`}
            onClick={closeModal}
          />
          <div
            className={`modal-window bg-rose-50 text-black p-6 border-2 border-black shadow-[0_10px_0_black] rounded-[1rem] w-full max-w-md z-10 transform transition-all duration-200 ${
              isVisible
                ? 'opacity-100 scale-1s00'
                : 'opacity-0 scale-95 pointer-events-none'
            }`}
          >
            <h2 className="text-xl font-bold mb-4">say hi</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="w-full border px-3 py-2 rounded focus:outline-1 focus:outline-offset-0 focus:outline-black focus:border-black bg-white"
                value={form.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full border px-3 py-2 rounded focus:outline-1 focus:outline-offset-0 focus:outline-black focus:border-black bg-white"
                value={form.email}
                onChange={handleChange}
                required
              />
              <textarea
                name="message"
                placeholder="Message"
                className="w-full border px-3 py-2 rounded focus:outline-1 focus:outline-offset-0 focus:outline-black focus:border-black bg-white"
                value={form.message}
                onChange={handleChange}
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border rounded"
                >
                  cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-500 text-white rounded hover:bg-black"
                >
                  submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
