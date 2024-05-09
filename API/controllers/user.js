import {User} from '../Models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import sgMail from "@sendgrid/mail"

export const register =  async (req,res)=>{
    const {name,gmail,password} = req.body

   try {
    let user = await User.findOne({gmail})

    if(user) return res.json({message:"User Already exist"});

    sgMail.setApiKey("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");

    let newOTP = "";
    for (let i = 0; i < 6; i++) {
        newOTP += Math.floor(Math.random() * 10);
    }
    const hashPass = await bcrypt.hash(password,10);
    const msg = {
        to:gmail,
        from:"sumithalder815@gmail.com",
        subject:"Email verification",
        text:`Use the OTP ${newOTP} to verify your email.`,
        html:`<p>Use the OTP ${newOTP} to verify your email.</p>`
    };

    await sgMail.send(msg);
    user = await User.create({name,gmail,password:hashPass,otp:newOTP});

    res.status(200).json({message:"OTP sent to email.",user});
    
   } catch (error) {
    res.json({message:error})
   }
}


export const verifyOTP = async (req,res) =>{
    const {sentOtp,userId} = req.body;
    try {
       const user = await User.findById(userId);
       if(!user) return res.status(400).json({message:"No user exits."});
       if(sentOtp === user.otp){
        await User.findByIdAndUpdate(userId, {isVerified: true});
        return res.status(200).json({message:"Email verifiaction successful."}); 
       } 
    } catch (error) {
        res.json({message:error});
    }
}

export const login = async (req,res) =>{
    const {gmail,password} = req.body

    try {
        let user = await User.findOne({gmail});
        // console.log("User is coming from login ",user)

        if(!user) return res.json({message:"User not exist..!"})

        if(!user.isVerified) return res.json({message:"Email not verified"});

        const validPass = await bcrypt.compare(password,user.password);
        
        if(!validPass) return res.json({message:"Invalid credentials"});
      
        const token = jwt.sign({userId:user._id},"!@#$%^&*()",{
            expiresIn:'1d'
        })

        res.json({message:`Welcome ${user.name}`,token})

    } catch (error) {
        res.json({message:error.message})
    }
}


export const profile = async (req,res) =>{
    res.json({user : req.user})
}