const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.header("x-auth-token");
        if (!token) return res.status(401).send({ error: true, msg: "Access denied." });

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(error);
        res.status(400).send({ error: true, msg: "User logged out, login again" });
    }
};
