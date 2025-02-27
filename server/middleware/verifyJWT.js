// @ts-nocheck
import AppError from "../utils/appError.js";
import asyncHandle from "../utils/asyncHandle.js";
import { promisify } from "util";
import jwt from "jsonwebtoken";
import { User } from "../model/User.js";

const verifyJWT = asyncHandle(async (req, res, next) => {
  // 1 getting token and check if its there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    const cookietoken = req.cookies.jwt;
    if (cookietoken) {
      token = cookietoken;
    }
  }

  if (!token) {
    return next(
      new AppError("You are not logged in .Please login to get access", 401),
    );
  }

  // verify the token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.ACCESS_TOKEN_SECRET,
  );

  //check if the user exists still
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError(
        "the user belonging to this token does no longer exists",
        401,
      ),
    );
  }
  // check if the user changed password after the token was issued

  // if (currentCustomer.changedPasswordAfter(decoded.iat)) {
  //   return next(
  //     new AppError(
  //       "user recently changed password ! please login again. ",
  //       401,
  //     ),
  //   );
  // }
  //grant access to protected route
  req.user = currentUser;
  next();
});

export default verifyJWT;
