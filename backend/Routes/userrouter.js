import { Router } from "express";
import {
  getcart,
  addcart,
  removecart,
  userregister,
  userlogin,
} from "../Controllers/user.js";
import { sendOTP, verifyOtp, userauthMiddleWare } from "../middleware/auth.js";
const userrouter = Router();

userrouter.get("/getcart", userauthMiddleWare, getcart);
userrouter.post("/addcart", userauthMiddleWare, addcart);
userrouter.get("/removecart", userauthMiddleWare, removecart);
userrouter.post("/reg", userregister);
userrouter.post("/Sendotp", sendOTP);
userrouter.post("/verifyotp", verifyOtp);
userrouter.post("/login", userlogin);

export { userrouter };
 