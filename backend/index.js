import express from "express";
import dotenv from "dotenv";
import connectDB from "./db.js";
import { userrouter } from "./Routes/userrouter.js";
import { adminrouter } from "./Routes/adminrouter.js";
import cors from "cors"
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
connectDB();
app.use(cors())
app.use(express.json());
app.use("/user", userrouter);
app.use("/admin", adminrouter);

app.listen(PORT, () => {
  console.log("listening on ", PORT);
});
