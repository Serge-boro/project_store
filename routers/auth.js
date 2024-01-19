const { Router } = require('express')
const router = Router()
const User = require('../modules/user')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')
const keys = require('../keys')
const regEmail = require('../emails/registration')
const crypto = require('crypto')
const resetEmail = require('../emails/reset')
const { validateRegister } = require('../utils/validators')
const { validationResult } = require('express-validator')

const transporter = nodemailer.createTransport(
  sendgrid({
    auth: { api_key: keys.SENDGRID_API_KEY },
  })
)

router.get('/login', async (req, res) => {
  res.render('auth/login', {
    title: 'Login',
    isLogin: true,
    registerError: req.flash('registerError'),
    registerSuccess: req.flash('registerSuccessfully'),
    loginError: req.flash('loginError'),
  })
})

router.get('/signUp', async (req, res) => {
  res.render('auth/signUp', {
    title: 'sign Up',
    registerError: req.flash('registerError'),
    registerSuccess: req.flash('registerSuccessfully'),
    loginError: req.flash('loginError'),
  })
})

router.get('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login')
  })
})

router.post('/register', validateRegister, async (req, res) => {
  try {
    const { email, password, name } = req.body

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      req.flash('registerError', errors.array()[0].msg)
      return res.status(422).render('auth/signUp', {
        error: errors.array()[0].msg,
        data: {
          email: req.body.email,
          name: req.body.name,
        },
      })
    }

    const hashPassword = await bcrypt.hash(password, 10)

    const user = new User({
      email,
      name,
      password: hashPassword,
    })

    await user.save()
    await transporter.sendMail(regEmail(email))
    req.flash('registerSuccessfully', 'you were registered successfully')
    res.redirect('/auth/login')
  } catch (e) {
    console.log(e)
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const candidate = await User.findOne({ email })
    if (candidate) {
      const areSame = await bcrypt.compare(password, candidate.password)
      if (areSame) {
        req.session.user = candidate
        req.session.isAuthenficatedOwn = true
        req.session.save((err) => {
          if (err) throw err
          res.redirect('/')
        })
      } else {
        req.flash('loginError', 'Wrong password')
        res.redirect('/auth/login')
      }
    } else {
      req.flash('loginError', 'Email does not exist')
      res.redirect('/auth/login')
    }
  } catch (e) {
    console.log(e)
  }
})

router.get('/reset', (req, res) => {
  res.render('auth/reset', {
    title: 'Forget password',
    error: req.flash('error'),
  })
})
router.post('/reset', (req, res) => {
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        req.flash('error', 'Something wrong, try again later')
        return res.redirect('/auth/reset')
      }

      const token = buffer.toString('hex')
      const candidate = await User.findOne({ email: req.body.email })

      if (candidate) {
        candidate.resetToken = token
        candidate.resetTokenExp = Date.now() + 60 * 60 * 1000
        await candidate.save()
        await transporter.sendMail(resetEmail(candidate.email, token))
        res.redirect('/auth/login')
      } else {
        req.flash('error', 'Email like this doesnt exist ')
        res.redirect('/auth/reset')
      }
    })
  } catch (e) {
    console.log(e)
  }
})

router.get('/password/:token', async (req, res) => {
  if (!req.params.token) {
    return res.redirect('/auth/login')
  }

  try {
    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExp: { $gt: Date.now() },
    })
    if (!user) {
      return res.redirect('/auth/login')
    } else {
      res.render('auth/password', {
        title: 'New password',
        error: req.flash('error'),
        userId: user._id.toString(),
        token: req.params.token,
      })
    }
  } catch (e) {
    console.log(e)
  }
})

router.post('/password', async (req, res) => {
  try {
    const user = await User.findOne({
      id: req.body.userId,
      resetToken: req.body.token,
      resetTokenExp: { $gt: Date.now() },
    })

    if (user) {
      user.password = await bcrypt.hash(req.body.password, 10)
      user.resetToken = undefined
      user.resetTokenExp = undefined
      await user.save()
      res.redirect('/auth/login')
    } else {
      req.flash('loginError', 'Token time was expired')
      res.redirect('/auth/login')
    }
  } catch (e) {
    console.log(e)
  }
})

module.exports = router
