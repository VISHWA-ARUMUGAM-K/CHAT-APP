// @ts-nocheck
import express from "express";
import {
  getUsers,
  getMessages,
  sendMessage,
} from "../controllers/messageController.js";
import verifyJWT from "../middleware/verifyJWT.js";
const router = express.Router();

router.route("/users").get(verifyJWT, getUsers);
router.route("/:id").get(verifyJWT, getMessages);

router.route("/send/:id").post(verifyJWT, sendMessage);

export default router;
