import express from "express"
import { checkAuth, login, logout, register } from "../../../controllers/authController.js";
import { authMiddleware } from "../../../middleware/auth.middleware.js";

const router = express.Router();


router.route("/register").post(register).get((req, res) => {
  res.status(405).json({ success: false, message: "Method Not Allowed. Please send a POST request with name, email, phone, role, and password." });
});
router.route("/signup").post(register);

router.route("/login").post(login).get((req, res) => {
  res.status(405).json({ success: false, message: "Method Not Allowed. Please send a POST request with email and password." });
});
router.route("/signin").post(login);

router.route("/logout").post(logout).get(logout);

router.route("/checkAuth").get(authMiddleware, checkAuth);
router.route("/check-auth").get(authMiddleware, checkAuth);
router.route("/me").get(authMiddleware, checkAuth);

export default router;