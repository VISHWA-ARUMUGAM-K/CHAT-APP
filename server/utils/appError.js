class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor); // this will hide the call stack of the error when this class is called to hide the implementation to the user
    //constructor call to myError wont show up in the stack trace
  }
}

export default AppError;
