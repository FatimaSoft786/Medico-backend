const express = require("express");
const {register,login,verifyOtp} = require("../Controller/User");
const { verify } = require("jsonwebtoken");
const router = express.Router();
router.post("/register",register);
router.post("/login",login);
router.post("/verify",verifyOtp);
module.exports = router;