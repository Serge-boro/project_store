const keys = require('../keys')

module.exports = function (email) {
  return {
    to: email,
    from: keys.EMAIL_FROM,
    subject: 'Registration succeeded',
    html: `
    <h1>Welcome to our store</h1>
    <p>you successfully created an account with the email - ${email}</p>
    <hr/>
    <a href="${keys.BASE_URL}">Come Back</a>
    `,
  }
}
