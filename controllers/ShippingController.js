const Shipping = require("../models/Shipping");
const User = require("../models/User");
const Cart = require("../models/Cart");

class ShippingController {
  getShippingInfo = async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select("state");
      let data = await Shipping.findOne({
        state_name: user.state,
        delivery_partner_name: req.body.delivery_partner_name,
      });
      let productCount = await Cart.findOne({ userID: req.user._id });

      let count = 0;

      productCount.products.forEach(countFunction);
      function countFunction(item) {
        count = count + item.quantity;
      }
      if (count - 1 > 1) {
        if (data.state_name === "Kerala") {
          data.price = data.price + (count - 1) * 30;
        } else {
          data.price = data.price + (count - 1) * 50;
        }
        res.send({ error: false, data: data });
      } else {
        res.send({ error: false, data: data });
      }
    } catch (error) {
      console.error(error);
      res.send({ error: true, msg: "An Error Occured" });
    }
  };
}

module.exports = ShippingController;
