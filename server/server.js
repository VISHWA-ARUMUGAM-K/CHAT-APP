// @ts-nocheck
import express from "express";
import { app, server, io } from "./config/socket.js";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import AppError from "./utils/appError.js";
import errorHandler from "./middleware/errorHandler.js";
import connectDB from "./config/dbconn.js";
import cors from "cors";
import mongoose from "mongoose";
import logEvents from "./utils/logEvent.js";
import path from "path";
// import { dirname } from "path";
// import { fileURLToPath } from "url";
// const __filename = fileURLToPath(import.meta.url);
//
// const __dirname = dirname(__filename);

//TODO: REMOVE THE COMMENT
process.on("uncaughtException", (err) => {
  // console.log(err.stack); to work with stack for error handling
  console.log(err.name, `\t${err.message}`);
  console.log("UNHANDLED EXCEPTION !  Shutting down...");
  process.exit(1);
});

const PORT = process.env.PORT || 3500;
const __dirname = path.resolve();

app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
connectDB();

if (process.env.NODE_ENV === "development") {
  console.log("running in ", process.env.NODE_ENV);
  app.use(morgan("dev"));
} else if (process.env.NODE_ENV === "production") {
  console.log("running in ", process.env.NODE_ENV);
  app.use(morgan("dev"));
}

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist/")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
  });
}

// app.all("*", (req, res, next) => {
//   res.status(404);
//   if (req.accepts("html")) {
//     res.sendFile(path.join(__dirname, "views", "404.html"));
//   } else if (req.accepts("json")) {
//     res.json({ error: "404 Not Found" });
//   } else {
//     res.type("txt").send("404 not found");
//   }
//
//   next(new AppError(`Cant find ${req.originalUrl} on this server`, 404));
// });

app.use(errorHandler);

const system = server.listen(PORT, () =>
  console.log(`server running on port ${PORT}`),
);

mongoose.connection.once("open", () => {
  console.log("connected to MongoDB");
  system;
});

mongoose.connection.on("error", (err) => {
  console.log("mongoose error", err);
  logEvents(
    `${err.no}: ${err.code} \t${err.syscall} \t${err.hostname}`,
    "mongoErrLog.log",
  );
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION !  Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
