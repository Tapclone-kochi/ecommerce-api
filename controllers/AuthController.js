const bcrypt = require('bcryptjs');

const User = require('../models/User');

class AuthController {
    register = async (req, res, next) => {
        try {
            const user = new User(req.body);

            const salt = await bcrypt.genSalt(Number(process.env.SALT));
            user.password = await bcrypt.hash(user.password, salt);
            await user.save();
    
            res.send({ error: false, msg: "User Created!!"});    
        } catch (error) {
            console.error(error);
            res.send({ error: true, msg: "Could not create user"});    
        }
    }

    login = async (req, res, next) => {
        try {
            const user = await User.findOne({ email: req.body.email });
            if (!user) return res.status(400).send({ error: true, msg: "Invalid email or password"});

            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            );
            if (!validPassword)
                return res.status(400).send({ error: true, msg: "Invalid email or password"});

            const token = user.generateAuthToken();
            res.send(token);
        } catch (error) {
            console.log(error);
            res.send("An error occured");
        }
    }

    profile = async (req, res, next) => {
        try {
            const user = await User.findById(req.user._id).select("-password -__v");
            if (!user) return res.status(404).send({ error: true, msg: "Profile not Found" })
            res.send(user);
        } catch (error) {
            console.log(error);
            res.send("An error occured");
        }
    }

    loginWithMobile = async (req, res, next) => {
        try {
            const user = await User.findOne({ mobile: req.body.mobile });
            if (!user) return res.status(400).send({ error: true, msg: "Invalid mobile or password"});

            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            );
            if (!validPassword)
                return res.status(400).send({ error: true, msg: "Invalid password"});

            const token = user.generateAuthToken();
            res.send(token);
        } catch (error) {
            console.log(error);
            res.send("An error occured");
        }
    }

}

module.exports = AuthController;