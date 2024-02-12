const model = require("../Model/DoctorServices");
const doctors = require("../Model/Doctor");

const service = async(req,res)=>{
    const {doctor_service} = req.body;
    try {
        let check = await model.findOne({doctor_service: doctor_service});
            check = await model.create({
                doctor_service: doctor_service,
            });
         res.status(200).json({error: false, message: check})
        
    } catch (error) {
        res.status(500).json({error: true,message: error.message});
    }
};

const getServices = async(req,res)=>{
    try {
        
       let check = await model.find();
       res.status(200).json({error: false,services: check})

    } catch (error) {
        res.status(500).json({error: false, message: error.message});
    }
};

const fetchDoctors =async(req,res)=>{
    try {
        const {firstName,specialties,location} = req.body;
        const doctors = await doctors.find({firstName: firstName,specialties: specialties,location: location});
        res.status(200).json({error: false,doctors: doctors})
        
    } catch (error) {
        res.status(500).json({error: true,message: error.message});
    }
}

module.exports = {
    service,
    getServices,
    fetchDoctors
}