import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import routes from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(morgan("dev"));

app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
  connectDB();
});
