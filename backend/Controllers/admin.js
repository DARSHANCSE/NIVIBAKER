import { item, admin } from "../models/adminmodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const additems = async (req, res) => {
  const { name, itemno, instock, price } = req.body;
  try {
    const exist = await item.findOne({ itemno: itemno });
    console.log(exist);
    if (exist) {
      return res.send({ message: "item already exists" });
    }
    const initem = await item.create({
      name: name,
      itemno: itemno,
      instock: instock,
      price: price,
    });
    console.log("success");
    res.send({ message: `inserted item ${initem.name}` });
  } catch (err) {
    res.send({ message: `err ${err}` });
  }
};
const deleteitems = async (req, res) => {
  const { itemno } = req.body;
  try {
    const initem = await item.findOne({ itemno: itemno });

    if (!initem) return res.send({ message: `item doesnt exist` });

    const deleteitem = await item.deleteOne({ itemno: itemno });
    res.send({ message: `deleted item ${initem.name}` });
  } catch (err) {
    console.log(`${err}`);
  }
};

const createtoken = (email) => {
  return jwt.sign(email, process.env.ADMIN_JWT_SECRET);
};
const adminregister = async (req, res) => {
  const { name, email, pass } = req.body;
  const salt = await bcrypt.genSalt(10);
  try {
    if (pass.length < 8) res.send({ message: "password is weak" });
    const existing = await admin.findOne({ email: email });
    if (existing) {
      res.send({ message: "admin already exists" });
    }
    console.log("hello");
    const hashpass = await bcrypt.hash(pass, salt);
    console.log(hashpass);
    const adminobj = await admin.create({
      name: name,
      email: email,
      pass: hashpass,
    });
    res.status(200).send({ message: "successfull" });
  } catch (err) {
    res.status(400).send({ message: `err:${err}` });
  }
};

const adminlogin = async (req, res) => {
  const { email, pass } = req.body;
  try {
    const adminobj = await admin.findOne({ email: email });
    if (!adminobj) {
      res.status(404).send({ message: "no admin found" });
    }
    console.log(admin);
    const passcomp = await bcrypt.compare(pass, adminobj.pass);
    console.log(passcomp);
    if (passcomp) {
      const token = createtoken(adminobj.email);
      res.send({ message: "success", bearertoken: `${token}` });
    } else {
      res.send({ message: "pass mismatch" });
    }
  } catch (err) {
    res.send({ message: `${err}` });
  }
};

const getitems = async (req, res) => {
  try {
    const items = await item.find();
    res.send({ data: items });
  } catch (err) {
    res.send(`${err}`);
  }
};
export { additems, adminlogin, adminregister, deleteitems, getitems };
