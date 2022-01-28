const Shipping = require("../models/Shipping");
const User = require("../models/User");
const Cart = require("../models/Cart");

class ShippingController {
  getShippingInfo = async (req, res) => {
    try {
      let data = await Shipping.find({
        state_name: req.query.state,
      });

      let productCount = await Cart.findOne({ userID: req.user._id });

      let count = 0;

      productCount.products.forEach(countFunction);
      function countFunction(item) {
        count = count + item.quantity;
        // console.log(item.quantity);
      }
      console.log(count);
      data.forEach((el, index) => {
        if (count - 1 >= 1) {
          if (el.state_name === "Kerala") {
            data[index].price = el.price + (count - 1) * 30;
          } else {
            data[index].price = el.price + (count - 1) * 50;
          }
        }  
      });

      res.send({ error: false, data: data });
    } catch (error) {
      console.error(error);
      res.send({ error: true, msg: "An Error Occured" });
    }
  };
}

module.exports = ShippingController;
