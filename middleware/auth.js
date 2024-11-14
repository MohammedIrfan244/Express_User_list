const jwt=require('jsonwebtoken')
const dotenv=require('dotenv')


module.exports=(req,res,next)=>{
    const token=req.headers['authorization']
    if(!token) return res.status(403).send('unauthorized')
      try{
    const decoded=jwt.verify(token.split(' ')[1],process.env.JWT_SECRET)
    req.user=decoded
    next()
    }catch(err){
      res.status(401).send('token invalid')
    }
  }