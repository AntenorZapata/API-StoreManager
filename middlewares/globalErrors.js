// const httpStatus = require('http-status');

const handleError = (err, res) => {
  const { code, statusCode, message } = err;
  return res.status(statusCode).json({
    err: {
      code,
      message,
    },
  });
};

module.exports = {
  handleError,
};