const userModel=require('../models/userModel')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const doctorModel=require('../models/doctorModel')
const appointmentModel = require('../models/appointmentModel')
const moment=require('moment')
const nodemailer = require('nodemailer');
//register controller
const registerController=async(req,res)=>{

  try{  
    const existingUser=await userModel.findOne({email:req.body.email})
    if(existingUser){
      return res.status(200).send({message:'User Already Exists',success:false})
    }
    const password=req.body.password
    const salt=await bcrypt.genSalt(10)
    const hashedPassword=await bcrypt.hash(password,salt)
    req.body.password=hashedPassword
    const newUser=new userModel(req.body)
    await newUser.save()
    res.status(201).send({message:'Registered Successfully',success:true})
  }
  catch(error){
    console.log(error);
    res.status(500).send({success:false, message:`Register Controller ${error.message}`})
  }
}

// login controller 
const loginController=async(req,res)=>{
  try{
    const user=await userModel.findOne({email:req.body.email})
    if (!user){
      return res.status(200).send({message:'user not found', success:false})
    }
    const isMatch=await bcrypt.compare(req.body.password,user.password)
    if(!isMatch){
      return res.status(200).send({message:'Invalid Email or Password',success:false})
    }
    const token=jwt.sign({id:user._id},process.env.JWT_SECRET, {expiresIn:'1d'})
    res.status(200).send({message:'Login Success',success:true, token})
  }
  catch(error){
    console.log(error);
    res.status(500).send({message:`Error in  Login CTRL ${error.message}`})
  }
}

const authController=async(req,res)=>{
  try {
    const user=await userModel.findById({_id:req.body.userId})
    user.password=undefined
    if(!user){
      return res.status(200).send({
        message:'user not found',
        success:false
      })
    }
    else{
      res.status(200).send({
        success:true,
        data:user
      })
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message:'auth error',
      success:false,
      error
    })
  }
}


const applyDoctorController =async(req,res)=>{
  try {
    const newDoctor=await doctorModel({...req.body,status:'pending'})
    await newDoctor.save()
    const adminUser=await userModel.findOne({isAdmin:true})
    const notification=adminUser.notification
    notification.push({
      type:'apply-doctor-request',
      message:`${newDoctor.firstName} ${newDoctor.lastName} has applied for doctor account`,
      data:{
        doctorId:newDoctor._id,
        name:newDoctor.firstName+" "+newDoctor.lastName,
        onClickPath:'/admin/doctors'
      }
    })
    await userModel.findByIdAndUpdate(adminUser._id,{notification})
    res.status(201).send({
      success:true,
      message:'Doctor Accound Applied Successfully'
    })
  } 
  catch (error) {
    res.status(500).send({
      success:false,
      error,
      message:'Error while applying for doctor'
    })
  }
}

const getAllNotificationController=async(req,res)=>{
  try {
    const user=await userModel.findOne({_id:req.body.userId})
    const seennotification=user.seennotification;
    const notification=user.notification;
    seennotification.push(...notification)
    user.notification=[]
    const updatedUser= await user.save()
    res.status(200).send({
      success:true,
      message:"all notification marked as read",
      data:updatedUser,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message:'Error in notification',
      success:false,
      error,

    })
  }
}

const deleteAllNotificationController =async(req,res)=>{
    try {
      const user=await userModel.findOne({ _id:req.body.userId})
      user.notification=[]
      user.seennotification=[]
      const updatedUser=await user.save()
      updatedUser.password=undefined
      res.status(200).send({
        success:true,
        message:"notification deleted successfully",
        data:updatedUser
      })
  } catch (error) {
      console.log(error);
      res.status(500).send({
        success:false,
        message:'unable to delete notification',
        error
      })
  }
}


const getAllDoctorController =async(req,res)=>{
  try {
    const doctors=await doctorModel.find({status:'approved'})
    res.status(200).send({
      success:true,
      message:"Doctors List fetched successfully",
      data:doctors,
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success:false,
      error,
      message:"Error while fetching doctor"
    })
  }
}

const bookAppointmentController =async(req,res)=>{
  
  try {
    req.body.date =moment(req.body.date, 'DD-MM-YYYY').toISOString()
    req.body.time =moment(req.body.time, 'HH:mm').toISOString()
    req.body.status='pending'
    const newAppointment=new appointmentModel(req.body)
    await newAppointment.save()
    const user=await userModel.findOne({_id:req.body.doctorInfo.userId})
    user.notification.push({
      type:'New-Appointment-Request',
      message:`A new appointment request from ${req.body.userInfo.name}`,
      onClickPath:'/user/appointments'
    })
    await user.save()
    res.status(200).send({
      success:true,
      message:'Appointment Booked Successfully'
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success:false,
      error,
      message:'Error while Booking Appointment'
    })
  }
}

const bookingAvailabilityController =async(req,res)=>{
  try {
    const date=moment(req.body.date,'DD-MM-YYYY').toISOString()
    const fromTime=moment(req.body.time,'HH:mm').subtract(1,'hours').toISOString()
    const toTime =moment(req.body.time,'HH:mm').add(1,'hours').toISOString()
    const doctorId =req.body.doctorId
    const appointments= await appointmentModel.find({doctorId,date,time:{
      $gte:fromTime,$lte:toTime,
    }})
    if(appointments.length>0){
      return res.status(200).send({
        message:'Appointment not avilable at this time',
        success:true
      })
    }
    else{
      return res.status(200).send({
        success:true,
        message:'Appointment Available'
      })
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success:false,
      error,
      message:'error while booking appointment'
    })
  }
}
const userAppointmentsController =async(req,res)=>{
  try {
    const appointments=await appointmentModel.find({
      userId:req.body.userId
    })
    res.status(200).send({
      success:true,
      message:"user appointments fetched successfully",
      data:appointments
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success:false,
      error,
      message:  "Error in user appointments",
    })
  }
}



const forgetPassword = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "10m" });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD_APP_EMAIL,
      },
    });

    // Frontend reset URL with token
    const resetUrl = `http://localhost:5173/reset-password/${token}`;

    const mailOptions = {
      from: process.env.EMAIL,
      to: req.body.email,
      subject: "Reset Password",
      html: `
        <h1>Reset Password</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link expires in 10 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Reset link sent to email" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reset Password Controller
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

module.exports={loginController,registerController,authController,applyDoctorController,getAllNotificationController,deleteAllNotificationController,getAllDoctorController,bookAppointmentController,bookingAvailabilityController,userAppointmentsController,forgetPassword,resetPassword}