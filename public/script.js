function checkUrl() {
  const url = document.getElementById('url').value
  let givenUrl
  try {
    givenUrl = new URL(url)
  } catch (error) {
    console.log(error)
    alertFailedSubmit()
    return false
  }
  return true
}

function alertFailedSubmit() {
  const submitAlert = document.getElementById('submit-alert')
  submitAlert.textContent = 'The URL format is not correct!'
}

function copyText() {
  const copyText = document.getElementById('short-url').textContent
  const copyButton = document.getElementById('copy-button')
  navigator.clipboard.writeText(copyText)
    .then(() => {
      copyButton.textContent = 'Copied!!!'
    })
    .catch(error => console.log(error))
}