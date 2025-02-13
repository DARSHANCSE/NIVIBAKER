import { item } from "../models/adminmodel.js";
import { user, otps } from "../models/usermodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const getcart = async (req, res) => {
  const { email } = req.body;
  try {
    const userdata = await user.findOne({ email: email });
    res.send({ message: "success", cart: userdata.cart });
  } catch (err) {
    res.send({ message: err });
  }
};
const addcart = async (req, res) => {
  const { email, itemno } = req.body;
  try {
    const itemdata = await item.findOne({ itemno: itemno });
    console.log(itemdata);
    const userdata = await user.findOne({ email: email });
    const cartitem = userdata.cart.find(
      (cartitem) => cartitem.item.itemno == itemno
    );
    if (cartitem) {
      cartitem.count += 1;
    } else {
      userdata.cart.push({ item: itemdata });
    }

    await userdata.save();
    res.send({ message: "success", cart: userdata.cart });
  } catch (err) {
    res.send({ message: `${err}` });
  }
};
const removecart = async (req, res) => {
  const { email, itemno } = req.body;
  try {
    const itemdata = await item.findOne({ itemno: itemno });

    console.log(itemdata);
    const userdata = await user.findOne({ email: email });
    const cartitem = userdata.cart.find(
      (cartitem) => cartitem.item.itemno == itemno
    );
    if (cartitem) {
      if (cartitem.count > 1) {
        cartitem.count -= 1;
      } else {
        userdata.cart.pop({ item: itemdata });
      }
    } else {
      return res.send({ message: "item not found" });
    }

    await userdata.save();
    res.send({ message: "success", cart: userdata.cart });
  } catch (err) {
    res.send({ message: `${err}` });
  }
};

const createtoken = (email) => {
  return jwt.sign(email, process.env.USER_JWT_SECRET);
};

const userregister = async (req, res) => {
  const { name, email, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  try {
    if (password.length < 8) res.send({ success:false,message: "passwordis weak" });
    const existing = await user.findOne({ email: email });
    if (existing) {
      return res.send({ message: "user already exists" });}
    
      console.log("hello");
      const hashpassword = await bcrypt.hash(password, salt);
      console.log(hashpassword);
      const userobj = await user.create({ name: name, email, pass: hashpassword });
      return res.status(200).send({ success:true,message: "successfull" });  
  }
   catch (err) {
    res.status(400).send({success:false, message: `${err}` });
  }
};

const userlogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userobj = await user.findOne({ email: email });
    if (!userobj) {
      return res.status(404).send({ success:false,message: "no user found" });
    }
    console.log(userobj);
    const passwordcomp = await bcrypt.compare(password, userobj.pass);
    console.log(passwordcomp);
    if (passwordcomp) {
      const token = createtoken(userobj.email);
      return res.send({success:true, message: "success", Token: `${token}` });
    } else {
      return res.send({ success:false,message: "password mismatch" });
    }
  } catch (err) {
    return res.send({  success:false,message: `error${err}` });
  }
};
export { getcart, addcart, removecart, userlogin, userregister };
