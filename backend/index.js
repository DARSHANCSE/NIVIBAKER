import express from "express";
import dotenv from "dotenv";
import connectDB from "./db.js";
import { userrouter } from "./Routes/userrouter.js";
import { adminrouter } from "./Routes/adminrouter.js";
import cors from "cors"
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);   
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

connectDB();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors())
app.use(express.json());
app.use("/user", userrouter);
app.use("/admin", adminrouter);

app.listen(PORT, () => {
  console.log("listening on ", PORT);
});
