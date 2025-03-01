import { item } from "../models/adminmodel.js";
import { user, otps } from "../models/usermodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {OAuth2Client} from "google-auth-library";
const getcart = async (req, res) => {
  const { email } = req.body;
  try {
    const userdata = await user.findOne({ email: email });
    if (!userdata) {
      return res.send({ message: "user not found" });
    }
    res.send({ message: "success", cart: userdata.cart });
  } catch (err) {
    res.send({ message: `error ${err}` });
  }
};

const clearcart = async (req, res) => {
  const { email } = req.body;
  try {
    const userdata = await user.findOne({ email: email });
    userdata.cart = [];
    await userdata.save();

    res.send({ message: "success", cart: userdata.cart });
  } catch (err) {
    res.send({ message: `${err}` });
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
const getitems = async (req, res) => {
  try {
    const items = await item.find();
    console.log(items);
    res.send({ data: items });
  } catch (err) {
    res.send(`${err}`);
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
const updatecart = async (req, res) => {  
  const { email, itemno, count } = req.body;
  try {
    const itemdata=await item.findOne({itemno:itemno});
    const userdata = await user.findOne({ email: email });
    const cartitem = userdata.cart.find(
      (cartitem) => cartitem.item.itemno == itemno
    );
    if (cartitem) {
      cartitem.count = count;
    } else {  
      return res.send({ message: "item not found" });
    }
    await userdata.save();
    res.send({ message: "success", cart: userdata.cart });
  } catch (err) {
    res.send({ message: `${err}` });
  }
};


const deletecartitem = async (req, res) => {
  const { itemno,email } = req.body;

  try {
    const initem = await item.findOne({ itemno: itemno });
    const userdata = await user.findOne({ email: email });
    const cartitem = userdata.cart.pop({ item: initem });
    await userdata.save();
    res.send({ message: `deleted item ${initem.name}` });
  } catch (err) { 
    console.log(`${err}`);
  }
};
const createtoken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.USER_JWT_SECRET);
};


const userregister = async (req, res) => {
  const { name, email, password} = req.body;
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
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const usergooglelogin = async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name } = ticket.getPayload();
    console.log("Received Email:", email);
    
    const userobj = await user.findOne({ email });
    console.log("User Found in DB:", userobj);

    let authToken;
    if (!userobj) {
      const userdata = await user.create({ name, email });
      authToken = createtoken({ email: userdata.email, id: userdata._id });
    } else {
      authToken = createtoken({ email: userobj.email, id: userobj._id });
    }

    return res.status(200).json({ success:true, token: authToken });
  } catch (err) {
    return res.status(500).json({ sucess:false,message: `error: ${err.message}` });
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
      const token = createtoken({"email":userobj.email,"id":userobj.id});
      return res.send({success:true, message: "success", Token: `${token}` });
    } else {
      return res.send({ success:false,message: "password mismatch" });
    }
  } catch (err) {
    return res.send({  success:false,message: `error${err}` });
  }
};





export { getcart, addcart, removecart, userlogin, userregister,getitems,deletecartitem,updatecart,clearcart,usergooglelogin };
