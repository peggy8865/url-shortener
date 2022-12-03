const express = require('express')
const router = express.Router()

const URL = require('../../models/urls')
require('../../utilities/getRandomString')

router.get('/', (req, res) => {
  res.render('index')
})

router.post('/', (req, res) => {
  const url = req.body.url
  if (!url.trim().length) return

  // if the url has been shortened before, provide the previously generated shortUrl
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

router.get('/:shortUrl', (req, res) => {
  const shortUrl = req.params.shortUrl

  URL.findOne({ shortUrl })
    .lean()
    .then(item => {
      if (item) {
        res.redirect(item.url)
      } else {
        res.redirect('/')
      }
    })
    .catch(error => console.log(error))
})

module.exports = router