import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import routes from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";
app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps, curl) or matching allowedOrigin
      if (!origin || origin === allowedOrigin || origin === "http://localhost:5173" || origin === "http://localhost:5174") {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev to avoid CORS blocking
      }
    },
    credentials: true,
  }),
);
app.use(morgan("dev"));

// Static uploads serving
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", routes);
app.use("/auth", routes);

// Allow root-level POST /login, /register, and /logout
app.post("/login", (req, res, next) => {
  req.url = "/v1/auth/login";
  routes(req, res, next);
});
app.post("/register", (req, res, next) => {
  req.url = "/v1/auth/register";
  routes(req, res, next);
});
app.post("/logout", (req, res, next) => {
  req.url = "/v1/auth/logout";
  routes(req, res, next);
});

// In development, redirect browser page requests to frontend dev server
app.use((req, res, next) => {
  if (req.method === "GET" && req.accepts("html") && !req.path.startsWith("/api") && !req.path.startsWith("/uploads")) {
    const clientBase = process.env.CLIENT_URL || "http://localhost:5173";
    return res.redirect(`${clientBase}${req.originalUrl}`);
  }
  next();
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Server Error:", err);
  const isClientError =
    err.name === "MulterError" ||
    err.name === "ValidationError" ||
    (err.message && (err.message.includes("Images only") || err.message.includes("Upload error")));
  const statusCode = err.status || (isClientError ? 400 : 500);
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
  connectDB();
});
