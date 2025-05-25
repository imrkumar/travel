const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const protect = async(req, res, next) => {
  try{
    const authHeader = req.headers.authorization;

  if(!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization header missing or malformed" });
  }

  const token = authHeader.split(" ")[1];

  const decoded= jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.userid).select("-password");

  if(!user) {
    return res.status(401).json({ message: "User associated with token not found" });
  }
  req.user = user;
  next();
  
  }catch(error) {
    if(error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
    }
    if(error.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token" });
    }
   console.error("Auth error:", error.message);
   return res.status(500).json({ message: "Server error during authentication" });
  }

};

module.exports = protect;