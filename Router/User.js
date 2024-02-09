const express = require("express");
const {register,login,verifyOtp,checkEmail,forgotPassword} = require("../Controller/User");
const router = express.Router();
router.post("/register",register);
router.post("/login",login);
router.post("/verify",verifyOtp);
router.post("/checkEmail",checkEmail);
router.put("/forgot",forgotPassword);
module.exports = router;