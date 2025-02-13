import { Router } from "express";
import {
  additems,
  adminlogin,
  adminregister,
  deleteitems,
  getitems,
} from "../Controllers/admin.js";
import { adminauthMiddleWare, sendOTP, verifyOtp } from "../middleware/auth.js";
const adminrouter = Router();

adminrouter.post("/additems", adminauthMiddleWare, additems);
adminrouter.post("/deleteitem", adminauthMiddleWare, deleteitems);
adminrouter.get("/getitem", adminauthMiddleWare, getitems);
adminrouter.post("/login", adminlogin);
adminrouter.post("/register", adminregister);
adminrouter.post("/Sendotp", sendOTP);
adminrouter.post("/verifyotp", verifyOtp);

export { adminrouter };
