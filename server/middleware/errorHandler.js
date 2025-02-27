import logEvents from "../utils/logEvent.js";

const sendErrorDev = (err, res) => {
  const status = err.status;
  const statusCode = err.statusCode ? err.statusCode : 500;
  res.status(statusCode).json({
    status: status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  const status = err?.status;
  const statusCode = err?.statusCode ? err.statusCode : 500;

  //Operational error,trusted error:send message to client
  if (err.isOperational) {
    res.status(statusCode).json({
      status: status,
      message: err.message,
    });

    //Progamming or other unknown error: to stop leaking details
  } else {
    console.error("ERROR", err);
    res.status(500).json({
      status: "error",
      message: "something went wrong",
    });
  }
};

const errorHandler = (err, req, res, next) => {
  //logging to the file
  logEvents(
    `${err.name} : ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    "errLog.txt",
  );

  //logging error accordingly to the environment

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = Object.assign(err); //need to check Object.assign

    // if (error.name === "CastError") error = handleCastErrorDB(error);
    // if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    // if (error.name === "ValidationError") error = handleValidation(error);
    // if (error.name === "JsonWebTokenError") error = handleJWTError();
    // if (error.name === "TokenExpiredError") {
    //   error = handleJWTExpiredError();
    // }
    console.log(`the error is ${error}`);
    sendErrorProd(error, res);
  }
};

export default errorHandler;
