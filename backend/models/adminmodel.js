import mongoose from "mongoose";
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  itemno: { type: Number, required: true, Unique: true },
  instock: { type: Boolean, default: true },
  price: { type: Number, required: true },
});

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  pass: { type: String, required: true },
});
const item = mongoose.model("item", itemSchema);
const admin = mongoose.model("admin", adminSchema);
export { item, itemSchema, admin };
