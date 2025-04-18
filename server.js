const express = require('express')
const colors= require('colors')
const morgan = require('morgan')
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
//dot env configuration
dotenv.config();

//mongoDb connection
connectDB();

//rest objec
const app =express()


//middlewares 
app.use(express.json())
app.use(morgan('dev'))

//routes
app.use("/api/v1/user", require("./routes/userRoutes"))
app.use("/api/v1/admin",require("./routes/adminRoutes"))
app.use("/api/v1/doctor",require("./routes/doctorRoutes"))

//static files
app.use(express.static(path.join(__dirname,"./client/dist")))


app.get("*",function(req,res){
  res.sendFile(path.join(__dirname,"./client/dist/index.html"))
})
//port                      
const port=process.env.PORT || 8080

//listen
app.listen(port, ()=>{
  console.log(
    `Server is running in ${process.env.NODE_MODE} Mode on port ${process.env.PORT}`.bgCyan.white
  );
})