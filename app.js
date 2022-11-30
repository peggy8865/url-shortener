const express = require('express')
const exphbs = require('express-handlebars')

const app = express()
const URL = require('./models/urls')
require('./config/mongoose')

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.urlencoded({ extended: true }))

function getRandomString() {
  const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz'
  const upperCaseLetters = lowerCaseLetters.toUpperCase()
  const numbers = '1234567890'
  const collection = lowerCaseLetters + upperCaseLetters + numbers
  let randomString = ''
  for (let i = 0; i < 5; i++) {
    const index = Math.floor(Math.random() * collection.length)
    randomString += collection[index]
  }
  return randomString
}

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/', (req, res) => {
  const url = req.body.url
  if (!url.trim().length) return
  
  URL.findOne({ url })
    .lean()
    .then(item => {
      if (item) {
        res.render('index', { url, shortUrl: item.shortUrl })
      } else {
        const shortUrl = getRandomString()
        URL.create({ url, shortUrl })
          .then(() => {
            res.render('index', { url, shortUrl })
          })
          .catch(error => console.log(error))
      }
    })
    .catch(error => console.log(error))
})

app.get('/:shortUrl', (req, res) => {
  const shortUrl = req.params.shortUrl

  URL.findOne({ shortUrl })
    .lean()
    .then(item => {
      if(item) {
        res.redirect(item.url)
      } else {
        res.redirect('/')
      }
    })
    .catch(error => console.log(error))
})

app.listen(3000, () => {
  console.log('Server is listening on http://localhost:3000')
})