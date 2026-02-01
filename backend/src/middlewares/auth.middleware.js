// auth.middleware.js - UPDATED
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Check for token in cookies first
  let token = req.cookies.token;
  
  // If not in cookies, check Authorization header
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    console.log('❌ No token found in request');
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log('✅ User authenticated:', decoded.id);
    next();
  } catch (error) {
    console.error('❌ Token verification failed:', error.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;