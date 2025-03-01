import { Router } from "express";
import {
  additems,
  adminlogin,
  adminregister,
  deleteitems,
  getitems,
  addimage
} from "../Controllers/admin.js";
import { adminauthMiddleWare, sendOTP,verifyOtp } from "../middleware/auth.js";
const adminrouter = Router();

adminrouter.post("/additems", adminauthMiddleWare,addimage, additems);
adminrouter.delete("/deleteitem", adminauthMiddleWare, deleteitems);
adminrouter.get("/getitems",getitems);
adminrouter.post("/login", adminlogin);
adminrouter.post("/register", adminregister);
adminrouter.post("/Sendotp", sendOTP);
adminrouter.post("/verifyotp", verifyOtp);

export { adminrouter };
