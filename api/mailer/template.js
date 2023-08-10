const { APP_URL } = require('##/config.js')

function activate_account(token) {
  const subject = 'Account Activation'
  const html = `
    <h1>Account Activation</h1>
    <p>Thank you for signing up for Waylap.com!</p>
    <p>To use your account, you will need to confirm your email address</p>
    <p>Click on the link below to activate your account.</p>
    <a href="${APP_URL}/auth/activate/${token}">Activate your account</a>
    <p>Note: The above buttons have a 5-minutes expiration date</p>
  `
  return [subject, html]
}

module.exports = {
  activate_account
}