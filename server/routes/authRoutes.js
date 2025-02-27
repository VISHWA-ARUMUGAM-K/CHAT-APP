// @ts-nocheck
import express from "express";
import {
  signup,
  login,
  logout,
  checkAuth,
} from "../controllers/authController.js";
import verifyJWT from "../middleware/verifyJWT.js";
const router = express.Router();

router.route("/signin").post(signup);
router.route("/login").post(login);
router.route("/logout").post(logout);

router.route("/update").get(verifyJWT, (req, res) => {
  res.status(200).json({ message: "working on it" });
});

router.route("/check").get(verifyJWT, checkAuth);

export default router;
