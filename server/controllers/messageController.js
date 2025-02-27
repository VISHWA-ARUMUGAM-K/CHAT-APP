// @ts-nocheck
import asyncHandle from "../utils/asyncHandle.js";
import { User } from "../model/User.js";
import { Message } from "../model/Message.js";
import AppError from "../utils/appError.js";
import jwt from "jsonwebtoken";
import { io } from "../config/socket.js";
import { getReceiverSocketId } from "../config/socket.js";

export const getUsers = asyncHandle(async (req, res) => {
  const loggedInUserId = req.user._id;
  const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } });

  res.status(200).json(filteredUsers);
});

export const getMessages = asyncHandle(async (req, res) => {
  const { id: userChatId } = req.params;
  const myId = req.user._id;

  const messages = await Message.find({
    $or: [
      { senderId: myId, receiverId: userChatId },
      { senderId: userChatId, receiverId: myId },
    ],
  });

  res.status(200).json(messages);
});

export const sendMessage = asyncHandle(async (req, res) => {
  const { text, image } = req.body;
  const { id: receiverId } = req.params;
  const senderId = req.user._id;

  let imageUrl;
  if (image) {
    //make s3 bucket to work here
  }

  const newMessage = new Message({
    senderId,
    receiverId,
    text,
    image: imageUrl,
  });
  await newMessage.save();

  const receiverSocketId = getReceiverSocketId(receiverId);
  console.log(receiverSocketId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", newMessage);
  }

  res.status(201).json({ message: newMessage });
});
