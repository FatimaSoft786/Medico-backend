const bcrypt = require("bcryptjs")
const model = require("../Model/Patient");
const generateOTP = require("../service/generateOtp");
const nodemailer = require("nodemailer");
const moment = require("moment")
const cloudinary = require("cloudinary").v2;
  const  data =   cloudinary.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.CLOUDKEY,
    api_secret: process.env.CLOUDSECRET
});



let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth:{
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD
    }
})

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

const checkEmail = async(req,res)=>{
    try {
        
     const user = await model.findOne({email: req.body.email});
     if(!user){
        return res.status(400).json("User with this email does not exist")
     }else {
        const otp = generateOTP();
           await model.findByIdAndUpdate(
                    {_id: user._id},
                    {$set: {otp: otp}},
                    {new: true});
          let mailOption = {
                from: process.env.SMTP_MAIL,
                to: req.body.email,
                subject: "Otp verification",
                text: `Your otp is: ${otp} will expire after 10 minute`
            };
            transporter.sendMail(mailOption,function(error){
          if(error){
            res.status(404).json(error)
          }else{
            res.status(200).json("Please check your email ")
          }
            });          
     }

    } catch (error) {
        res.status(500).json(error.message)
    }
}

const forgotPassword = async(req,res)=>{
    try {
      
        const data = await model.findOne({ _id: req.body.id });
    console.log(data);
    const salt = await bcrypt.genSalt(10);
    const securePass = await bcrypt.hash(req.body.password, salt);
     const userData = await model.findByIdAndUpdate(
      { _id: data._id },
      { $set: { password: securePass } },
      { new: true }
    );
    res.status(200).json("Your password has been updated");

    } catch (error) {
        res.status(500).json(error.message)
    }
}

const likeDoctor = async(req,res)=>{
    try {
  const {patientID,doctorID} = req.body;
   const data = await model.findOne({_id: patientID});
   const result = await data.favorite.includes(doctorID);
   if(result === true){
    res.status(400).json({error:  false,message: "Already available in the favorite list"})
   }else{
    await model.findByIdAndUpdate({
        _id: data._id
    },
    {
        $push: {favorite: doctorID}
    },{new: true})
   }
   res.status(200).json({error: false,message: "Doctor added in the Favorite"});
        
    } catch (error) {
        res.status(500).json({error: true,message: error.message});
    }
};

const unlikeDoctor = async(req,res)=>{
    try {
  const {patientID,doctorID} = req.body;
   const data = await model.findOne({_id: patientID});
   const result = await data.favorite.includes(doctorID);
   if(result === true){
       await model.findByIdAndUpdate({
        _id: data._id
    },
    {
        $pull: {favorite: doctorID}
    },{new: true});
    res.status(200).json({error: false,message: "Removed from  Favorite"});
   }else{
    res.status(200).json({error: false,message: "Favorite is empty"})
   }
   
 
 
        
    } catch (error) {
        res.status(500).json({error: true,message: error.message});
    }
};

const uploadPatientPicture = async(req,res)=>{
  try {
    if(!req?.files.profile){
      return res.status(400).json({error: true,message: "Please upload an image"});
     
    }else{
   const file = req.files.profile;
  
        const result = await cloudinary.uploader.upload(file.tempFilePath,{
            public_id: file.name,
            resource_type: "profile",
            folder: "Patients"
        });
        console.log(result);

      // res.status(200).json({error: false, message: result})
    }
  } catch (error) {
    res.status(500).json({error: true,message: error});
  }
}

module.exports = {
    register,
    login,
    verifyOtp,
    checkEmail,
    forgotPassword,
    likeDoctor,
    unlikeDoctor,
    uploadPatientPicture
}