const axios = require('axios');

module.exports.shortenLink = async (code) => {
  const { KUTT_API_KEY } = process.env

  return axios.post('https://kutt.it/api/v2/links', {
    target: "https://www.nayanalimitless.in/reset-password.html?code=" + code
  }, 
  {
    headers: {
      'X-API-KEY': KUTT_API_KEY
    }
  })
}