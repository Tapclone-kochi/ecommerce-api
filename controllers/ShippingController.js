const Shipping = require('../models/Shipping')

class ShippingController {
  getShippingInfo = async (req, res) => {
    try {
      let data = await Shipping.find()
      if(data.length) {
        res.send({ error: false, data: data })
      } else {
        res.send({ error: true, msg: "No Data Found!!" })
      }
    } catch (error) {
      console.error(error);
      res.send({ error: true, msg: "An Error Occured" })
    }
  }
}

module.exports = ShippingController;