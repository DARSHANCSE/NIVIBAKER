import mongoose from "mongoose";
import { itemSchema } from "./adminmodel.js";
import { v4 as uuidv4 } from "uuid";  
const cartItemSchema = new mongoose.Schema({
  item: { type: itemSchema, required: true },
  count: { type: Number, required: true, default: 1 },
});
const orderschema = new mongoose.Schema({
  id: { type: String, unique: true ,uuid:true},
  userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  item: { type: itemSchema, required: true },
  count: { type: Number, required: true, default: 1 },
  status: { type: String, required: true },
  orderdate: { type: Date, required: true },
});
const userSchema = new mongoose.Schema({
  id: { type: String, unique: true ,uuid:true},
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  pass: { type: String, required: true },
  cart: { type: [cartItemSchema], default: [] },
  orders: { type: [cartItemSchema], default: [] },
  address: { type: String, required: true },
  phone: { type: Number, required: true },
  pincode: { type: Number, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }});

const OTPSchema = new mongoose.Schema({
  email: { type: String, required: true },
  OTP: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, index: { expires: "5m" } }, 
});

userSchema.pre("save", function (next) {
  if (!this.id) {
    this.id = uuidv4();d
  }
  next();
});

const otps = mongoose.model("otps", OTPSchema);
const user = mongoose.model("user", userSchema);
const order = mongoose.model("order", orderschema);
export { user, otps, order };
