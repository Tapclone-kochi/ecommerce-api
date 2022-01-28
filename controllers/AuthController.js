const bcrypt = require('bcryptjs');
const User = require('../models/User');
const ResetPassword = require('../models/ResetPassword')
const ShortUniqueId = require('short-unique-id');
const sms = require('../helpers/sms')
const kutt = require('../helpers/kutt')
class AuthController {
    register = async (req, res, next) => {
        const {
            name,
            mobile,
            password
        } = req.body

        if(!name) {
            res.send({ error: true, msg: "Name Required"});
            return
        }

        if(!mobile) {
            res.send({ error: true, msg: "Mobile Required"});
            return
        }

        if(!password) {
            res.send({ error: true, msg: "Password Required"});
            return
        }

        if(mobile.length !== 10) {
            res.send({ error: true, msg: "Mobile No. must be 10 digits"});
            return
        }
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
            if (!user) return res.status(400).send({ error: true, msg: "Cannot find specified user"});

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
            if (!user) return res.status(400).send({ error: true, msg: "Cannot find specified user"});

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

    adminLogin = async (req, res) => {
        try {
            const user = await User.findOne({ email: req.body.email, user_type: 'admin' });
            if (!user) return res.status(400).send({ error: true, msg: "Cannot find specified user"});

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

    forgotPassword = async (req, res) => {
        const { mobile } = req.params

        try {
            const user = await User.findOne({ mobile: mobile }).select('_id mobile')

            if(!user) {
                res.send({ error: true, msg: "User not found" })
                return
            }
            const uid = new ShortUniqueId({ length: 6 })

            const reset = new ResetPassword({
                userID: user._id,
                resetCode: uid()
            })

            await reset.save()
            const result = await kutt.shortenLink(reset.resetCode)
            
            await sms.sendResetPasswordSMS(user.mobile, result.data.link);
            res.send({ error: false, msg: "Reset Link SMS sent to mobile. Check your messages" })
        } catch (error) {
            console.error(error);
            res.send({ error: true, msg: "An Error Occured" })
        }
    }

    checkResetPasswordLinkValid = async (req, res) => {
        const { code } = req.body

        try {
            const resetCode = await ResetPassword.findOne({ resetCode: code })
            if(!resetCode) {
                res.send({ error: true, msg: "An Error Occured" })
                return
            } else {
                res.send({ error: false })
            }
        } catch (error) {
            res.send({ error: true, msg: "An Error Occured" })
        }
    }

    resetPassword = async (req, res) => {
        const { code, newPassword } = req.body

        try {
            const reset = await ResetPassword.findOne({ resetCode: code })
            if(!reset) {
                res.send({ error: true, msg: "Invalid Link" })
                return
            } else {
                const user = await User.findById(reset.userID)

                if(!user) {
                    res.send({ error: true, msg: "Invalid User" })
                    return
                }

                const salt = await bcrypt.genSalt(Number(process.env.SALT));
                user.password = await bcrypt.hash(newPassword, salt);
                await user.save()
                
                await ResetPassword.findByIdAndDelete(reset._id)
                res.send({ error: false })
            }
        } catch (error) {
            res.send({ error: true, msg: "An Error Occured" })
        }
    }

}

module.exports = AuthController;