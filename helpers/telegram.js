const axios = require('axios');

module.exports.sendOrderPlacedToAdmin = () => {

  const {
    TELEGRAM_BOT_TOKEN,
    TELEGRAM_ADMIN_CHAT_ID,
  } = process.env
  return axios.post('https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendMessage', {
    chat_id: TELEGRAM_ADMIN_CHAT_ID,
    text: 'Hello Admin, a new order has been placed at Nayana Limitless. Login to https://admin.nayanalimitless.in to review the order. Thank You.'
  })
}