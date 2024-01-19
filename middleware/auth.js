module.exports = function (req, res, next) {
  if (!req.session.isAuthenficatedOwn) {
    return res.redirect('/auth/login')
  }

  next()
}
