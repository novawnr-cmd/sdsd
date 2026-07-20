import { Router } from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/auth";
import { authLimiter } from "../middleware/rateLimiter";
import {
  register,
  login,
  googleLogin,
  facebookLogin,
  getProfile,
  updateProfile,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
} from "../controllers/authController";

const router = Router();

router.post(
  "/register",
  authLimiter,
  validate([
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("name").notEmpty().withMessage("Name is required"),
  ]),
  register
);

router.post(
  "/login",
  authLimiter,
  validate([
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ]),
  login
);

router.post(
  "/google",
  authLimiter,
  validate([body("idToken").notEmpty().withMessage("Google ID token is required")]),
  googleLogin
);

router.post(
  "/facebook",
  authLimiter,
  validate([body("accessToken").notEmpty().withMessage("Facebook access token is required")]),
  facebookLogin
);

router.get("/profile", authenticate, getProfile);

router.put(
  "/profile",
  authenticate,
  validate([
    body("email").optional().isEmail().withMessage("Valid email is required"),
    body("phone").optional().isMobilePhone("any").withMessage("Valid phone number is required"),
  ]),
  updateProfile
);

router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

router.post(
  "/forgot-password",
  authLimiter,
  validate([body("email").isEmail().withMessage("Valid email is required")]),
  forgotPassword
);

router.post(
  "/reset-password",
  validate([
    body("token").notEmpty().withMessage("Token is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ]),
  resetPassword
);

export default router;
