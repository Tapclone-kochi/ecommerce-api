const User = require('../models/User');
const Order = require('../models/Order')

class CommonController {
  getDashboardData = async (req, res) => {
    try {
      const userCount = await User.countDocuments()
      const placedOrderCount = await Order.countDocuments({ status: 'order_placed' })
      const dispatchedOrderCount = await Order.countDocuments({ status: 'order_dispatched' })
      const totalAmount = await Order.aggregate([
        {
          $group: {
            totalAmount: {
              $sum: "$totalAmount"
            },
            _id: null
          }
        }
      ])
      res.send({ error: false, userCount: userCount, placedOrderCount: placedOrderCount, dispatchedOrderCount: dispatchedOrderCount, totalAmount: totalAmount[0].totalAmount/100 })
    } catch (error) {
      console.error(error);
      res.send({ error: true, msg: "An Error Occured fetching data" })
    }
  }
}

module.exports = CommonController;