export const errorHandler = (statusCode, message, details = null, errorCode = null) => {
  const error = new Error();
  error.statusCode = statusCode;
  error.message = message;
  error.details = details;
  error.errorCode = errorCode;
  return error;
};