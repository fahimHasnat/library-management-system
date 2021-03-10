const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {

  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(" ")[1];

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.TokenCode);
  } catch (err) {
    if (err.message === "jwt expired") {
      err.message = "Session Expired"
    }
    err.statusCode = 500;
    throw err;
  }

  if (!decodedToken) {
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    throw error;
  }

  req.user = decodedToken;
  req.token = token;
  next();
};