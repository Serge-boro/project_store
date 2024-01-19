const { Router } = require('express')
const router = Router()
const Store = require('../modules/storeItems')
const auth = require('../middleware/auth')

router.get('/', async (req, res) => {
  try {
    const storeItems = await Store.find()
    const featured = storeItems.filter((item) => item.featured === true)
    res.render('home', {
      title: 'home page',
      isHome: true,
      storeItems: featured,
    })
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
