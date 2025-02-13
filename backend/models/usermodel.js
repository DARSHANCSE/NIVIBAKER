import mongoose from "mongoose";
import { itemSchema } from "./adminmodel.js";
import { v4 as uuidv4 } from "uuid";  
const cartItemSchema = new mongoose.Schema({
  item: { type: itemSchema, required: true },
  count: { type: Number, required: true, default: 1 },
});
const userSchema = new mongoose.Schema({
  id: { type: String, unique: true ,uuid:true},
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  pass: { type: String, required: true },
  cart: { type: [cartItemSchema], default: [] },
});

const OTPSchema = new mongoose.Schema({
  email: { type: String, required: true },
  OTP: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, index: { expires: "5m" } }, // TTL index to expire documents after 5 minutes
});

userSchema.pre("save", function (next) {
  if (!this.id) {
    this.id = uuidv4(); // Generate a unique ID for the user using uuid
  }
  next();
});

const otps = mongoose.model("otps", OTPSchema);
const user = mongoose.model("user", userSchema);

export { user, otps };
