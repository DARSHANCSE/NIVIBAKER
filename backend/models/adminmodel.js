import mongoose from "mongoose";
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  itemno: { type: Number, required: true, unique: true },
  instock: { type: String, default: true },
  price: { type: Number, required: true },
  image:{type:String,required:true},
  description: { type: String, required: true },
  rating: { type: Number, required: true },
  numReviews: { type: Number, required: true },
  category: { type: String, required: true },
});

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  pass: { type: String },
  oauthId: { type: String },
  oauthToken: { type: String }, 
  createdAt: { type: Date, default: Date.now },
});
const item = mongoose.model("item", itemSchema);
const admin = mongoose.model("admin", adminSchema);
export { item, itemSchema, admin };
