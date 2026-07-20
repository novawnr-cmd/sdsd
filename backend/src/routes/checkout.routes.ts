import { Router } from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/auth";
import { orderLimiter } from "../middleware/rateLimiter";
import { processCheckout } from "../controllers/checkoutController";

const router = Router();

router.post(
  "/",
  authenticate,
  orderLimiter,
  validate([
    body("shippingAddress").notEmpty().withMessage("Shipping address is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("phone").notEmpty().withMessage("Phone number is required"),
  ]),
  processCheckout
);

export default router;
