import nodemailer from "nodemailer"
import {user,otps} from "../models/usermodel.js"
import bcrypt from "bcrypt"

const mailer = async (recipientEmail, otp) => {
    try {
    const transporter=nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, 
        auth: {
          user: "darshansridharbabu23@gmail.com",
          pass: "frny dcju xuia xijl",
        },
      })
      
    
      const info = await transporter.sendMail({
        from: '"Darshan" <darshansridharbabu23@gmail.com>', 
        to: recipientEmail, 
        subject: "Your OTP Code", 
        text: `Your OTP is: ${otp}`, 
        html: `<b>Your OTP is: ${otp}</b>`, 
      });
      
      
      return {message:"success"}
      console.log("OTP sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending OTP:", error);
        return "failure"
      
    }
  };    

  const saveOTP = async (email, otp) => {
    try {
        const salt=await bcrypt.genSalt(10)
        const sotp=otp.toString()
        const hotp= await bcrypt.hash(sotp,salt)
      const otpDocument = { email, OTP:hotp, createdAt: new Date() };
      console.log(hotp)
      await otps.create({email:email,OTP:hotp});
      console.log("OTP saved successfully");
    } catch (error) {
      console.error("Error saving OTP:", error);
    }
  };
export {saveOTP,mailer}