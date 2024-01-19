const { Router } = require('express')
const router = Router()
const auth = require('../middleware/auth')
const Order = require('../modules/order')

router.get('/', auth, async (req, res) => {
  const user = await req.user.populate('cart.items.courseId').execPopulate()
  const courses = mapCoursesItem(user.cart)
  try {
    const orders = await Order.find({
      'user.userId': req.user._id,
    }).populate('user.userId')

    res.render('orders', {
      title: 'Orders',
      isOrder: true,
      userName: req.user ? req.user.name : null,
      itemCard: courses,
      priceCard: computerPrice(courses),
      totalItems: totalCount(courses),
      orders: orders.map((item) => {
        return {
          ...item._doc,
          price: item.shopItems.reduce((total, item) => {
            return (total += item.count * item.shopItem.price)
          }, 0),
        }
      }),
    })
  } catch (e) {
    console.log(e)
  }
})
router.post('/', auth, async (req, res) => {
  try {
    const user = await req.user.populate('cart.items.courseId').execPopulate()
    const shopItems = user.cart.items.map((item) => ({
      count: item.count,
      shopItem: { ...item.courseId._doc },
    }))

    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user,
      },
      shopItems,
    })

    await order.save()
    await req.user.clearCart()

    res.redirect('/orders')
  } catch (e) {
    console.log(e)
  }
})

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

module.exports = router
