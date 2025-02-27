// @ts-nocheck
import asyncHandle from "../utils/asyncHandle.js";
import { User } from "../model/User.js";
import AppError from "../utils/appError.js";
import jwt from "jsonwebtoken";

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };

  //checking if it is production or development environment
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  //attaching with the cookie
  res.cookie("jwt", token, cookieOptions);

  //removing password from output not from database
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

export const login = asyncHandle(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide the email and password"));
  }

  const user = await User.findOne({ email: email }).select("+password").exec();

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  createSendToken(user, 201, res);
});

export const signup = asyncHandle(async (req, res, next) => {
  const { fullName, email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide the email and password"));
  }

  const user = await User.findOne({ email });
  if (user) return next(new AppError("User already exists"));
  let newUser = new User({
    fullName,
    email,
    password,
  });

  newUser = await newUser.save();

  if (newUser) {
    createSendToken(newUser, 201, res);
  } else {
    return next(new AppError("signin rules invalid"));
    // res.status(400).json({ message: "signin rules invalid" });
  }
});

export const logout = (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies?.jwt)
    return res.sendStatus(204); //no content
  else {
    try {
      res.cookie("jwt", "", {
        maxAge: 0,
      });

      res.sendStatus(204).json({ message: "logged out successfully" });
    } catch (err) {
      return next(new AppError("error in logout"));
      // console.log("error in logout", err);
    }
  }
};

export const updateProfile = asyncHandle(async (req, res, next) => {
  const { fullName, email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide the email and password"));
  }

  const user = await User.findOne({ email });
  if (user) return next(new AppError("User already exists"));
  let newUser = new User({
    fullName,
    email,
    password,
  });

  newUser = await newUser.save();

  if (newUser) {
    createSendToken(newUser, 201, res);
  } else {
    return next(new AppError("signin rules invalid"));
    // res.status(400).json({ message: "signin rules invalid" });
  }
});

export const checkAuth = (req, res) => {
  const userInfo = req.user;
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("error in checkauth");
    return next(new AppError("error in checkauth"));
  }
};
