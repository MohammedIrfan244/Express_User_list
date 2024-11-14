const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const User = require("./models/user");
const auth = require("./middleware/auth");

dotenv.config()
const app=express()
app.use(express.json())

const storage=multer.diskStorage({
  destination:(req,file,cb)=>cb(null,'./uploads/'),
  filename:(req,file,cb)=>cb(null,Date.now()+'-'+file.originalname)
})

const upload=multer({storage})

mongoose.connect(process.env.MONGO_URI)

app.get('/',(req,res)=>{
  res.send('hello world')
})

app.post('/register',async(req,res)=>{
  const {name, email, username, password}=req.body
  try{
    const hashedPassword=await bcrypt.hash(password,10)
    const user=new User({name,email,username,password:hashedPassword})
    await user.save()
    res.send("admin registered")
  }catch(err){
    res.send(err.message)
  }
})

app.post('/login',async(req,res)=>{
  const {email,password}=req.body
  try{
    const user=await User.findOne({email})
    if(!user|| await(bcrypt.compare(password,user.password))){
      return res.send('user not found')
    }
    const token=jwt.sign({id:user._id,email:user.email},process.env.JWT_SECRET)
    res.json({message:'login sucess',token})
  }catch(err){
    res.json({error:err.message})
  }
})

app.post('/users',auth,upload.single('photo'),async(req,res)=>{
  const {email,username,name}=req.body
  try{
    const user= new User({name,email,username,photo:req.file.path})
    await user.save()
    res.json(user)
  }catch(err){
    res.send(err.message)
  }
})

app.get('/users',async(req,res)=>{
  try{
    const users=await User.find()
  res.json(users)
  }catch(err){
    res.send(err.message)
  }
})

app.get('/users/:id',auth,async(req,res)=>{
  try{
    const user=await User.findById(req.params.id)
    if(!user)return res.send('no user found')
      res.json(user)
  }catch(err){
    res.json({err:err.message})
  }
})

app.put('/users/:id',auth,async(req,res)=>{
  try{
    const updatedData=req.body
    if(req.file)updatedData=req.file.path
   const user= await User.findByIdAndUpdate(req.params.id,updatedData,{new:true})
    if(!user)return res.send('no user found')
      res.json(user)
  }catch(err){
    res.json({error:err.message})
  }
})


app.delete('/users/:id',auth,async(req,res)=>{
  try{
    const user=await User.findByIdAndDelete(req.params.id)
    if(!user)return res.send('no user found')
      res.send('user has been deleted')
  }catch(err){
    res.json({error:err.message})
  }
})

const PORT=process.env.PORT||3000
app.listen(PORT,(err)=>{
  if(!err){
    console.log('server is running in port'+' '+PORT)
  }
})