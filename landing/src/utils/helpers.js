const GOOGLE_FORM_ACTION_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSf6fxD7zHv-VQQOAGYuDqKLn8IvZLBIv6ABrKBqBqU816NGJQ/formResponse'
const FIELD_IDS = {
  name: 'entry.1482034644',
  email: 'entry.307246192',
  message: 'entry.437726749',
}

export const submitToGoogleForms = async ({ name, email, message }) => {
  const formData = new FormData()
  formData.append(FIELD_IDS.name, name)
  formData.append(FIELD_IDS.email, email)
  formData.append(FIELD_IDS.message, message)

  try {
    const res = await fetch(GOOGLE_FORM_ACTION_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: formData,
    })
    return res
  } catch (err) {
    console.error('Form submission error:', err)
  }
}

export const generateRandomBackground = () => {
  const prefixes = ['b1', 'b2', 'b3', 'b4', 'b5']
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]

  const speed = Math.floor(Math.random() * 6)
  const hue = Math.floor(Math.random() * 16).toString(16)
  const sat = (4 + Math.floor(Math.random() * 5)).toString()
  const ligthOptions = ['8', '9', 'a', 'b', 'c', 'd']
  const lightness =
    ligthOptions[Math.floor(Math.random() * ligthOptions.length)]

  return `${prefix}.${speed}${hue}${sat}${lightness}`
}
