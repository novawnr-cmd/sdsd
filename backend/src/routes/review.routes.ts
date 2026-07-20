import { Router } from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validate";
import { authenticate, isAdmin, optionalAuth } from "../middleware/auth";
import {
  createReview,
  getProductReviews,
  approveReview,
  deleteReview,
} from "../controllers/reviewController";

const router = Router();

router.get("/:productId", optionalAuth, getProductReviews);

router.post(
  "/",
  authenticate,
  validate([
    body("productId").notEmpty().withMessage("Product ID is required"),
    body("rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),
  ]),
  createReview
);

router.patch("/:id/approve", authenticate, isAdmin, approveReview);
router.delete("/:id", authenticate, deleteReview);

export default router;
