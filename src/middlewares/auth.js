import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

export const protect = asyncHandler(async function (req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Please login first" });

  jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (err, user) => {
    if (err)
      return res
        .status(403)
        .json({ message: "You are not authorized to access this page" });
    req.user = user;
    next();
  });
});

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Admin access only" });
  }
};
