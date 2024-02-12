const express = require("express");
const {register,login,verifyOtp,updateDoctorInfo} = require("../Controller/Doctor");
const {service} = require("../Controller/Service")
const router = express.Router();
router.post("/register",register);
router.post("/login",login)
router.post("/verify",verifyOtp);
router.put("/updateInfo/:id",updateDoctorInfo);
router.post("/register",service);


module.exports = router;