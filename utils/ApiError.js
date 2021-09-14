class ApiError extends Error {
  constructor(message, code, statusCode) {
    super();
    this.code = code;
    this.statusCode = statusCode;
    this.message = message;
  }
}

module.exports = {
  ApiError,
};