import { Button } from './Button'
import Window from './Window'
import { submitToGoogleForms } from '../utils/helpers'
import { useState } from 'react'

export const ContactModal = ({ onClose }) => {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await submitToGoogleForms(form)
      setForm({ name: '', email: '', message: '' })
      setShowSuccess(true)

      setTimeout(() => {
        onClose()
      }, 1000)
    } catch (error) {
      console.error('Error submitting form:', error)
      setIsSubmitting(false)
    }
  }

  return (
    <Window
      title="say hi"
      onClose={onClose}
      defaultPosition={{ x: 10, y: 10 }}
    >
      {showSuccess ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-lg font-medium">message sent ✓</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="name"
            className="w-full border px-3 py-2 rounded focus:outline-1 focus:outline-offset-0 focus:outline-black focus:border-black bg-white"
            value={form.name}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
          <input
            type="email"
            name="email"
            placeholder="email"
            className="w-full border px-3 py-2 rounded focus:outline-1 focus:outline-offset-0 focus:outline-black focus:border-black bg-white"
            value={form.email}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
          <textarea
            name="message"
            placeholder="message"
            className="w-full border px-3 py-2 rounded focus:outline-1 focus:outline-offset-0 focus:outline-black focus:border-black bg-white"
            value={form.message}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
          <div className="flex justify-end gap-2">
            <Button
              type="submit"
              text={isSubmitting ? 'sending...' : 'send'}
              disabled={
                !form.email || !form.message || !form.name || isSubmitting
              }
            />
          </div>
        </form>
      )}
    </Window>
  )
}
