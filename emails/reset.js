const keys = require('../keys')

module.exports = function (email, token) {
  return {
    to: email,
    from: keys.EMAIL_FROM,
    subject: 'Restore password',
    html: `
    <h1>Did you forget the password?</h1>
    <p>If not, ignore the message</p>
    <p>otherwise click on link:</p>
    <a href="${keys.BASE_URL}/auth/password/${token}">Restore password</a>
    <hr/>
    <a href="${keys.BASE_URL}">Come back to store</a>
    `,
  }
}
