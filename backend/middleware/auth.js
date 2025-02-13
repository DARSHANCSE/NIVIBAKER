import { user, otps } from "../models/usermodel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { saveOTP, mailer } from "../utils/nodemailer.js";

const adminauthMiddleWare = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  console.log("token " + token);
  try {
    const token_decode = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
    console.log("Token:" + token_decode.id);
    req.headers.id = token_decode.id;
    console.log("hello " + req.headers.id);
    next();
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: `${err}` });
  }
};
const userauthMiddleWare = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  console.log("token " + token);
  try {
    const token_decode = jwt.verify(token, process.env.USER_JWT_SECRET);
    console.log("Token:" + token_decode.id);
    req.headers.id = token_decode.id;
    console.log("hello " + req.headers.id);
    next();
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: "Error in jwt" });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await otps.findOne({ email: email });

    if (!user) res.send({ message: "otp expired" });

    const check = await bcrypt.compare(otp, user.OTP);
    if (check) {
      console.log("otp is correct");
      res.send({ message: "otp is correct" ,verified:true});
    } else {
      res.send({ message: "otp is not correct" ,verified:false});
    }
  } catch (err) {
    res.send({ message: "error" });
  }
};

const sendOTP = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);
  try {
    await saveOTP(email, otp);
    const c = await mailer(email, otp);
    res.send({success:true, message: c, otp: otp });
  } catch (err) {
    res.send({success:false, message: "err in send otp" });
  }
};

export { sendOTP, adminauthMiddleWare, verifyOtp, userauthMiddleWare };
