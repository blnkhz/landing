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
