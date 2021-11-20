const User = require('../models/User');

class UserController {
    getUserList = async (req, res) => {
        try {
            const users = await User.find({ user_type: 'user' }).select('-password -__v').lean()
            res.send({ error: false, items: users })
        } catch (error) {
            res.send({ error: false, msg: "An Error Occured" })
        }
    }

    updateUser = async (req, res) => {
        const updatedUser = {
            name: req.body.name,
            email: req.body.email,
        }
        try {
            const user = await User.findOneAndUpdate({ _id: req.params.id }, updatedUser)
            if (!user) {
                res.status(404).send({ error: true, msg: "User not Found" })
                return
            }
            res.send({ error: false, msg: "User Updated" })
        } catch (error) {
            res.send({ error: false, msg: "An Error Occured" })
        }
    }

    getUserProfile = async (req, res) => {
        try {
            const user = await User.findOne({ _id: req.params.id, user_type: 'user' }).select('-password -__v').lean()
            if (!user) {
                res.status(404).send({ error: true, msg: "User not Found" })
                return
            }
            res.send({ error: false, user: user })
        } catch (error) {
            res.send({ error: false, msg: error.message })
        }
    }
}

module.exports = UserController;