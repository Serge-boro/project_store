const { Router } = require('express')
const router = Router()
const Store = require('../modules/storeItems')
const auth = require('../middleware/auth')

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
  const user = await req.user.populate('cart.items.courseId').execPopulate()
  const courses = mapCoursesItem(user.cart)
  res.render('about', {
    title: 'About page',
    isAbout: true,
    userName: req.user ? req.user.name : null,
    itemCard: courses,
    priceCard: computerPrice(courses),
    totalItems: totalCount(courses),
  })
})

module.exports = router
