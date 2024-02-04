const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");

const JWT_SECRETE = "this is the very secrete string";
const fetchuser = (req, res, next) => {
    //get the user from jwt token and append id to request object
    const token = req.header('auth-token');
    if (!token) {
        res.statue(401).send({ error: " please authenticate using a valid token" });
    }
    try {
        const data = jwt.verify(token, JWT_SECRETE);
        req.user = data.user;
        next();
    } catch (error) {
        // console.error(error.message);
        res.statue(401).send({ error: " please authenticate using a valid token" });
    }
}

// router 3===========================================================================================
router.post('/getuser', fetchuser, async (req, res) => {

    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("please authenticate using a valid user");
    }
});

module.exports = router 