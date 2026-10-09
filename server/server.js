import path from "path";
import fs from "fs";
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

app.use((req, res, next) => {
  res.setHeader("Permissions-Policy", "unload=*");
  next();
});

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

const clientDistPath = path.resolve(__dirname, "../client/dist");
const hasClientBuild = fs.existsSync(clientDistPath);

if (hasClientBuild) {
  app.use(express.static(clientDistPath));
}

// Health check endpoints for deployment platforms (Render, Railway, AWS, etc.)
app.get(["/health", "/api/health"], (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "TexMarket API",
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// Root endpoint: serve frontend if built, or informative JSON response
app.get("/", (req, res) => {
  if (hasClientBuild) {
    return res.sendFile(path.join(clientDistPath, "index.html"));
  }
  return res.status(200).json({
    success: true,
    message: "TexMarket Backend API is live",
    version: "1.0.0",
    healthCheck: "/health",
    apiBase: "/api/v1"
  });
});

// SPA fallback: serve frontend index.html for non-API client routes if built
if (hasClientBuild) {
  app.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api") && !req.path.startsWith("/uploads")) {
      return res.sendFile(path.join(clientDistPath, "index.html"));
    }
    next();
  });
} else if (process.env.NODE_ENV !== "production") {
  // In development, redirect browser page requests to frontend dev server
  app.use((req, res, next) => {
    if (req.method === "GET" && req.accepts("html") && !req.path.startsWith("/api") && !req.path.startsWith("/uploads")) {
      const clientBase = process.env.CLIENT_URL || "http://localhost:5173";
      return res.redirect(`${clientBase}${req.originalUrl}`);
    }
    next();
  });
}

// 404 handler for unmatched API routes
app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`
  });
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
