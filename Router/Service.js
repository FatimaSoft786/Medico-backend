const express = require("express");
const {service,getServices,fetchDoctors} = require("../Controller/Service")
const router = express.Router();

router.post("/register",service);
router.get("/fetch",getServices);
router.get("/findDoctor",fetchDoctors);


module.exports = router;