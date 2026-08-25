import express from "express"
import { checkAuth, login, logout, register } from "../../../controllers/authController.js";
import { authMiddleware } from "../../../middleware/auth.middleware.js";

const router = express.Router();


router.route("/register").post(register);

router.route("/login").post(login);

router.route("/logout").post(logout);

router.route("/checkAuth").get(authMiddleware, checkAuth);


export default router;