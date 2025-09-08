import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/users.model.js";

export const generateAccessToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_ACCESS_TOKEN, {
    expiresIn: "15m",
  });

export const generateRefreshToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_REFRESH_TOKEN, { expiresIn: "7d" });

/////////registration///////////////////
export const userRegister = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const foundUser = await User.findOne({ email: email });
  if (foundUser) {
    res.status(400);
    throw new Error("User already exists");
  }

  const newUser = new User({ name, email, password });
  await newUser.save();
  res.status(201).json(newUser);
});

//////////LogIn//////////////////////////////////
export const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    res.status(404);
    throw new Error("Invalid user or password");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    accessToken,
  });
});

///////////LogOut////////////////////////////////
export const userLogout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.status(403);
    throw new Error("Invalid token");
  }
  user.refreshToken = null;
  await user.save();

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // true in production
    sameSite: "strict",
  });
  
  res.json({ message: "Logout successfull" });
});
