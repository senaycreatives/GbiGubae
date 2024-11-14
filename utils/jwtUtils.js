const jwt = require("jsonwebtoken");

const secretKey = "yourSecretKey";
const tokenExpiration = "5h";

const generateToken = (payload) => {
  return jwt.sign(payload, secretKey, { expiresIn: tokenExpiration });
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
