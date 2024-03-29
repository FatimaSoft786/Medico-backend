const bcrypt = require("bcryptjs")
const model = require("../Model/Doctor");
const generateOTP = require("../service/generateOtp");
const nodemailer = require("nodemailer");
const moment = require("moment")

let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth:{
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD
    }
});

const register = async(req,res)=>{
    try {

        let check = await model.findOne({email: req.body.email});
        if(check){
            res.status(400).json({error: true,message: "Sorry a user with this email already exist"})
        }else{
            const salt = await bcrypt.genSalt(10);
            const securePass = await bcrypt.hash(req.body.password,salt)
            const otp = generateOTP();
            check = await model.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: securePass,
                phoneNumber: req.body.phoneNumber,
                otp: otp
            });
            let mailOption = {
                from: process.env.SMTP_MAIL,
                to: req.body.email,
                subject: "Otp verification",
                text: `Your otp is: ${otp} will expire after 10 minute`
            };
            transporter.sendMail(mailOption,function(error){
          if(error){
            res.status(404).json({error: true,message: error})
          }else{
            res.status(200).json({error: false,message: "Please check your email"})
          }
            });
        }
        
    } catch (error) {
        res.status(500).json({error: true,message: error.message});
    }
};

const login = async(req,res)=>{
    try {   
     const user = await model.findOne({email: req.body.email});
     if(!user){
        return res.status(400).json({error: true,message: "Please try to login with correct credentials"})
     }
     const comparePass = await bcrypt.compare(req.body.password,user.password);
     if(!comparePass){
        return res.status(400).json({error: true,message: "Please try to login with correct credentials"});
     }
     res.status(200).json({error: false,message: user._id});

    } catch (error) {
        res.status(500).json({error: true,message: error.message})
    }
};

function isOTPExpired(createdAt){
    const expirationTime = moment(createdAt).add(10,"minutes")
    return moment()>expirationTime;
}

const verifyOtp = async(req,res)=>{
    try {
        const user = await model.findOne({otp: req.body.otp});
        if(user){
            const isExpired = isOTPExpired(user.updatedAt);
            if(isExpired){
                 res.status(404).json({error: true,message: "Your otp is expired"})
            }else{
                const data = await model.findByIdAndUpdate(
                    {_id: user._id},
                    {$set: {otp: ""}},
                    {new: true});
                    res.status(200).json({error: false,message: data});
            }
        }
    } catch (error) {
        res.status(500).json({error: true,message: error.message})
    }
};

 const updateDoctorInfo = async(req,res)=>{
    const {id} = req.params;
    console.log(req.body);
    try {
        
       const user = await model.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({error: false,message: user});

    } catch (error) {
        res.status(500).json({error: true,message: error.message});
    }

 }

 const findDoctor = async(req,res)=>{
    try {


        
    } catch (error) {
        res.status(500).json({error: true,message: error.message})
    }
 };



module.exports = {
    register,
    login,
    verifyOtp,
    updateDoctorInfo,
    findDoctor
}