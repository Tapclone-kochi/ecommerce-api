const axios = require('axios');

module.exports.sendDispatchSMS = (number, trackingCode, deliveryProvider, orderUnique) => {
  const {
    SMS_AUTHENTIC_KEY,
    SENDER_ID,
    DISPATCH_SMS_TEMPLATE_ID
  } = process.env

  return axios.get('http://sms.text91msg.com/http-tokenkeyapi.php?authentic-key=' + SMS_AUTHENTIC_KEY + '&senderid=' + SENDER_ID + '&route=1&number=' + number + '&message=Great News! Your Order ' + orderUnique +' is on the way. Track your Shipment to see the delivery status ' + deliveryProvider + ' ' +trackingCode + ' Regards! NAYANA&templateid=' + DISPATCH_SMS_TEMPLATE_ID)
}