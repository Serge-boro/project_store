const { body } = require('express-validator')
const User = require('../modules/user')

exports.validateRegister = [
  body('email', 'Please, input correct email adress')
    .isEmail()
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ email: value })
        if (user) {
          return Promise.reject('This email adress is exist already')
        }
      } catch (e) {
        console.log(e)
      }
    })
    .normalizeEmail(),
  body('password', 'Password have to be minimum 6 items length')
    .isLength({ min: 6, max: 56 })
    .isAlphanumeric()
    .trim(),
  body('confirm', 'Password doesnt matches, please check the password')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password has to be matches')
      }
      return true
    })
    .trim(),
  body('name', 'Field "name" should to includes a minimum of 3 symbols')
    .isLength({
      min: 3,
    })
    .trim(),
]
