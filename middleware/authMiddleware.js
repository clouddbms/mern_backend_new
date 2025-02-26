const jwt = require("jsonwebtoken");

//Authorization Middleware - Grants access to the route if the token is valid
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  const secretKey = process.env.secret_key;
  if (!token) {
    return res.status(401).json(
    {
      message: "Unauthorized, Token Not Found",
    });
  }

  jwt.verify(token.replace("Bearer ", ""), secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = decoded;
    next();
  });
};

module.exports = authMiddleware;
