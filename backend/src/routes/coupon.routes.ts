import { Router } from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validate";
import { authenticate, isSeller } from "../middleware/auth";
import {
  createCoupon,
  getCoupons,
  validateCoupon,
  deleteCoupon,
} from "../controllers/couponController";

const router = Router();

router.get("/", authenticate, isSeller, getCoupons);

router.post(
  "/",
  authenticate,
  isSeller,
  validate([
    body("code").notEmpty().withMessage("Coupon code is required"),
    body("discount")
      .isFloat({ min: 0.01 })
      .withMessage("Discount must be greater than 0"),
    body("discountType")
      .optional()
      .isIn(["PERCENTAGE", "FIXED"])
      .withMessage("Discount type must be PERCENTAGE or FIXED"),
  ]),
  createCoupon
);

router.post(
  "/validate",
  authenticate,
  validate([
    body("code").notEmpty().withMessage("Coupon code is required"),
    body("storeId").notEmpty().withMessage("Store ID is required"),
    body("cartTotal")
      .isFloat({ min: 0 })
      .withMessage("Cart total is required"),
  ]),
  validateCoupon
);

router.delete("/:id", authenticate, isSeller, deleteCoupon);

export default router;
