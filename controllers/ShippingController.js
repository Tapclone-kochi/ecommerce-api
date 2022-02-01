const Shipping = require("../models/Shipping");
const User = require("../models/User");
const Cart = require("../models/Cart");

class ShippingController {
  getShippingInfo = async (req, res) => {
    try {
      let data = await Shipping.find({
        state_name: req.query.state,
      });

      let searchQuery = {}
      if(req.user) {
        searchQuery = {
          userID: req.user._id
        }
      } else if(req.query.cartID) {
        searchQuery = {
          _id: req.query.cartID
        }
      }
  
      let productCount = await Cart.findOne(searchQuery);

      let count = 0;

      productCount.products.forEach(countFunction);
      function countFunction(item) {
        count = count + item.quantity;
        // console.log(item.quantity);
      }
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
