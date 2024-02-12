const mongoose = require("mongoose");
const doctorSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    location: {
        type: String,
        default: ""
    },
    postalCode: {
        type: String,
        default: ""
    },
    gender: {
        type: String,
        default: ""
    },
    dob: {
        type: String,
        default: ""
    },
    education: {
        type: String,
        default: ""
    },
    certificate_link:{
        type: String,
        default: ""
    },
    year_of_education: {
        type: String,
        default: ""
    },
    special_recognition: {
        type: String,
        default: ""
    },
    hospital_address: {
        type: String,
        default: ""
    },
    specialties: {
        type: String
    },
    signature: {
        type: String,
        default: ""
    },
    instagram: {
        type: String,
        default: ""
    },
    twitter: {
        type: String,
        default: ""
    },
    facebook: {
        type: String
    },
    about_us: {
        type: String,
        default: ""
    },
    account_status: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: ""
    },
    otp: {
        type: String,
        default: ""
    },
    availability: [
        {
            day: String,
            from_time: String,
            to_time: String,
            date: String
        }
    ],
    session_fee:[
        {
            title: String,
            price: Number
        }
    ]
},{
    timestamps: true
});
module.exports = mongoose.model("Doctor",doctorSchema)