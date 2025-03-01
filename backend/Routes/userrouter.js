import { Router } from "express";
import {
  getcart,
  addcart,
  removecart,
  userregister,
  userlogin,
  getitems,
  updatecart,
  deletecartitem,
  clearcart,
  usergooglelogin
} from "../Controllers/user.js";
import { sendOTP, verifyOtp, userauthMiddleWare } from "../middleware/auth.js";
const userrouter = Router();

userrouter.post("/getcart", userauthMiddleWare, getcart);
userrouter.get("/getitems", userauthMiddleWare,getitems);
userrouter.post("/addcart", userauthMiddleWare, addcart);
userrouter.post("/updatecart", userauthMiddleWare, updatecart);
userrouter.post("removecart", userauthMiddleWare, removecart);
userrouter.post("/deletecart", userauthMiddleWare, deletecartitem);
userrouter.post("/clearcart", userauthMiddleWare, clearcart);
userrouter.post("/googlelogin", usergooglelogin);
userrouter.post("/reg", userregister);
userrouter.post("/Sendotp", sendOTP);
userrouter.post("/verifyotp", verifyOtp);
userrouter.post("/login", userlogin);

export { userrouter };
 