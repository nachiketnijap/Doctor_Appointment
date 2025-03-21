const express=require("express")
const router=express.Router()
const authMiddleware =require('../middlewares/authMiddleware')
const { getDoctorInfoController, updateProfileController, getDoctorByIdController,doctorAppointmentController, updateStatusController } = require("../controllers/doctorController")


// get data of particular dotor 
router.post('/getDoctorInfo',authMiddleware,getDoctorInfoController)

// post update doctor profile 
router.post('/updateProfile', authMiddleware,updateProfileController)


// get single doctor info 
router.post('/getDoctorById',authMiddleware,getDoctorByIdController)


// get appointments 
router.get('/doctor-appointments',authMiddleware,doctorAppointmentController)

// post update status 
router.post('/update-status', authMiddleware,updateStatusController)

module.exports= router