const User = require('../model/userModel')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const userUtils = require('../utils/userUtils')
const express = require('express')
const app =express()
// password bycrypt

const securePassword = async(pass)=>{
    try{
        const passHash = await bcrypt.hash(pass,10)
        return passHash
    }catch(e){
        console.log("password err",err);
    }
}
module.exports.getLogin = async(req,res)=>{
    res.render('login')
}
module.exports.getOtp= async(req,res)=>{
    res.render('otpAuth')
}
module.exports.getUserHome = async(req,res)=>{
    const user =await User.findOne({email:req.session.userId})
    if(user){
        res.render('home',{user:user.name})
    }
}
module.exports.getSignup = async(req,res)=>{
    res.render('signup')
}
module.exports.postLogin = async(req,res)=>{
    try{

        const {email,password,phone}=req.body
        const user = await User.findOne({email})
        if(user){
            const matchPass = await bcrypt.compare(password,user.password)
            if(matchPass){
                req.session.userId = user.email
                res.render('home',{user:user.name})
            }else{
            res.render('login',{message:"please enter valid credentials"})

            }
        }else{
            res.render('login',{message:"Please Enter the registered email and password"})
        }
    }catch(err){
        console.log(err);
    }

}
module.exports.postSignup=async(req,res)=>{
    try{
        // test nodemailer
        let testaccount = await nodemailer.createTestAccount()
        // 
        const {name,email,password,phone}=req.body
        const bcryptPass = await securePassword(password)
        User.insertMany([{
            name:name,
            email:email,
            password:bcryptPass,
            phone:phone
        }])
        console.log("user created successfully");
        res.redirect('/')
    }catch(e){
        console.log("post signup",e.message);
    }
}

module.exports.postOtp=async(req,res)=>{
    res.redirect('/otpVerify')

}
module.exports.getOtpVerify=async(req,res)=>{
    res.render('otpVerify')

}
module.exports.postOtpVerify=async(req,res)=>{
    const userOtp = req.body.otp
    const user =await User.findOne({otp:userOtp})
    // const user =await User.findOne({otp:userOtp},{$unse})

    if(user){
         user.otp = 0
         req.session.userId = user.email
       // res.render('home',{user:user.name})
       res.redirect('/home')
    }
}

module.exports.getForgot=async(req,res)=>{
    res.render('forgot')
}
module.exports.postForgot=async(req,res)=>{
    const userEmail = req.body.email
    // generate a password reset token
    const resetToken = userUtils.generateToken()
    // save the reset token to user database
    userUtils.saveResetTokenToDatabase(userEmail,resetToken)

    // create a transport obj using nodemailer
    const transporter = nodemailer.createTransport({
        host:'smtp.gmail.com',
        auth:{
            user:'aryalechu98@gmail.com',
            // pass:process.env.EMAIL_PASSWORD,
            pass:'Virgo@123'
        }
    })

    // compose email
    const mailOptions = {
        from : 'aryalechu98@gmail.com',
        to:userEmail,
        subject:"Password Reset",
        text:`Click the following link to reset your password :http://localhost:3002/resetPassword?token=${resetToken}`
    }
    // send the mail
    transporter.sendMail(mailOptions,(error,info)=>{
        if(error){
            console.error(error.message);
            res.render('forgot',{message:"Error sending password reset email"})
        }else{
            console.log('Email sent: ' + info.response);
            res.render('forgot',{emailLink:true})
        }
    })
}
module.exports.getResetPassword=(req,res)=>{
    const resetToken = req.query.token
    // verify the token against the stored token in userdatabase
    if(resetToken){
      const user=  User.findOne({resetToken:resetToken})
      if(user){
          res.render('resetPass')
      }else{
        res.render('forgot',{message:"Invalid or expired rest token. Try again!"})
      }
    }else{
        res.render('forgot',{message:"Invalid or expired rest token. Try again!"})
    }
}
module.exports.postResetPassword=async(req,res)=>{
    const resetToken = req.query.token;
    const newPassword = req.body.newPassword
    const confirmPassword = req.body.confirmPassword

    // verify the token against the stored tokens
    if(resetToken){
     const user=   User.findOne({resetToken:resetToken})
     if(user){
        //validate the new password and confirm password
        if(newPassword === confirmPassword){
            // update the user's password in the database
            user.password = newPassword;
            // clear the reset token
            user.resetToken = undefined
            user.save((error)=>{
                if(error){
                    console.error(error);
                }else{
                    //  redirect to login page and display success message 
                    res.render('/login',{passwordMessage:"Password reset successfully"})
                }
            })
        }else{
            // handle password mismatch error
            res.render('resetPass',{message:"New password and confirm password do not match"})
        }
     }
    }else{
         // Handle missing token
        res.render('resetPass',{message:"Invalid reset token"})

    }

}
