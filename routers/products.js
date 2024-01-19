const { Router } = require('express')
const router = Router()
const Store = require('../modules/storeItems')
const auth = require('../middleware/auth')
const User = require('../modules/user')

let arrItems

function mapCoursesItem(item) {
  return item.items.map((c) => ({ ...c.courseId._doc, count: c.count }))
}
function computerPrice(course) {
  return course.reduce((total, item) => {
    return (total += item.price * item.count)
  }, 0)
}

function totalCount(course) {
  return course.reduce((total, item) => {
    return (total += item.count)
  }, 0)
}

router.get('/', auth, async (req, res) => {
  try {
    const storeItems = await Store.find()
    arrItems = storeItems
    const user = await req.user.populate('cart.items.courseId').execPopulate()
    const courses = mapCoursesItem(user.cart)

    res.render('products', {
      title: 'Products',
      isProduct: true,
      storeItems,
      userName: req.user ? req.user.name : null,
      itemCard: courses,
      priceCard: computerPrice(courses),
      totalItems: totalCount(courses),
    })
  } catch (error) {
    console.log(error)
  }
})

router.post('/add', auth, async (req, res) => {
  const storeId = await Store.findById(req.body.id)
  console.log(storeId)
  await req.user.addToCart(storeId)

  res.redirect('/products')
})

router.delete('/remove/:id', auth, async (req, res) => {
  await req.user.removeFromCart(req.params.id)

  const user = await req.user.populate('cart.items.courseId').execPopulate()
  const courses = mapCoursesItem(user.cart)
  const cart = {
    itemCard: courses,
    priceCard: computerPrice(courses),
    totalItems: totalCount(courses),
  }
  res.status(200).json(cart)
})

module.exports = router
