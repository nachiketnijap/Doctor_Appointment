const express=require('express')
const { loginController, registerController, authController,applyDoctorController,getAllNotificationController,deleteAllNotificationController, getAllDoctorController, bookAppointmentController, bookingAvailabilityController,userAppointmentsController } = require('../controllers/userController')
const authMiddleware = require('../middlewares/authMiddleware')

//router object
const router=express.Router()



// routes 
//Login || Post
router.post('/login',loginController)


//Register || Post 
router.post('/register',registerController)
//auth || post
router.post('/getUserData',authMiddleware,authController)


//apply doctor || post
router.post("/apply-doctor",authMiddleware,applyDoctorController)

//get notification || post
router.post("/get-all-notification",authMiddleware,getAllNotificationController)

//get notification || post
router.post("/delete-all-notification",authMiddleware,deleteAllNotificationController)


// get all doctors 
router.get('/getAllDoctors',authMiddleware,getAllDoctorController)

//book appointment
router.post('/book-appointment',authMiddleware,bookAppointmentController)

// booking availability 
router.post('/booking-availability',authMiddleware,bookingAvailabilityController)

// Appointment list
router.get('/user-appointments',authMiddleware,userAppointmentsController)


module.exports =router

