const { Schema, model } = require('mongoose')

const userSchema = Schema({
  email: {
    type: String,
    required: true,
  },
  name: String,
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExp: Date,
  cart: {
    items: [
      {
        count: {
          type: Number,
          required: true,
          default: 1,
        },
        courseId: {
          type: Schema.Types.ObjectId,
          ref: 'StoreItems',
          required: true,
        },
      },
    ],
  },
})

userSchema.methods.addToCart = function (course) {
  const cloneItems = [...this.cart.items]
  const idxCourse = cloneItems.findIndex((item) => {
    return item.courseId.toString() === course._id.toString()
  })

  if (idxCourse >= 0) {
    cloneItems[idxCourse].count = cloneItems[idxCourse].count + 1
  } else {
    cloneItems.push({
      courseId: course._id,
      // count: 1,
    })
  }

  this.cart = { items: cloneItems }
  return this.save()
}

userSchema.methods.removeFromCart = function (id) {
  let items = [...this.cart.items]
  const idx = items.findIndex(
    (item) => item.courseId.toString() === id.toString()
  )
  if (items[idx].count === 1) {
    items = items.filter((item) => item.courseId.toString() !== id.toString())
  } else {
    items[idx].count--
  }
  this.cart = { items }
  return this.save()
}

userSchema.methods.clearCart = function () {
  this.cart = { items: [] }
  return this.save()
}
module.exports = model('User', userSchema)
