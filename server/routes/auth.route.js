import express from "express";
import {
  signin,
  signup,
  google,
  signout,
  sendforgotPassword,
  createNewPassword,
  usercurrent // Added the usercurrent controller function
} from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validateObjectId from "../middlewares/validate.objectId.middleware.js";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.handler.js";
import jwt from "jsonwebtoken";
import generateToken from "../utils/generateToken.js";
import {
  valdiateEmail,
  valdiateLogin,
  valdiateRegister,
  valdiateResetPassword,
} from "../validations/users.schemas.js";
import { restePassword } from "../utils/html.template.js";
import sendMail from "../services/send.email.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
router.post("/signout", authMiddleware, signout);
router.put("/forgot-password", sendforgotPassword);
router.put(
  "/password-reset/:id",
  authMiddleware,
  validateObjectId,
  createNewPassword
);

/**
 * @desc Get information about the current user
 * @params GET /api/auth/current-user
 * @access PRIVATE (user logged in)
 **/
router.get("/current-user", authMiddleware, usercurrent);

export default router;
