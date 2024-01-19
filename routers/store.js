const { Router } = require('express')
const router = Router()
const auth = require('../middleware/auth')
const Store = require('../modules/storeItems')
// const {
//   mapCoursesItem,
//   // computerPrice,
//   // totalCount,
// } = require('../utils/helpers')

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

router.get('/:id', auth, async (req, res) => {
  const storeId = await Store.findById(req.params.id)
  const user = await req.user.populate('cart.items.courseId').execPopulate()
  const courses = mapCoursesItem(user.cart)
  res.render('store', {
    title: `${storeId.name}`,
    store: storeId,
    userName: req.user ? req.user.name : null,
    itemCard: courses,
    priceCard: computerPrice(courses),
    totalItems: totalCount(courses),
  })
})

module.exports = router
