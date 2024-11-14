const { verifyToken } = require("../utils/jwtUtils");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token is missing" });
  }

  const { valid, decoded, error } = verifyToken(token);

  if (!valid) {
    return res.status(403).json({ error: error || "Invalid access token" });
  }

  req.user = decoded;
  next();
};

module.exports = authMiddleware;
