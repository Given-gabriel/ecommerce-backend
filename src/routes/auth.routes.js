import { Router } from "express";
import {
  userLogin,
  userLogout,
  userRegister,
} from "../controllers/auth.controller.js";
import {
  loginValidation,
  signupValidation,
  validate,
} from "../middlewares/authValidation.js";

const router = Router();

router.post("/register", validate(signupValidation), userRegister);
router.post("/login", validate(loginValidation), userLogin);
router.post("/logout", userLogout);

export default router;
