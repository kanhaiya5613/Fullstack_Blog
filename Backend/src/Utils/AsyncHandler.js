// steps
// create a function that takes a request handler as input
// return a new function that wraps the request handler in a Promise
// catch any errors and pass them to next()
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler
};
