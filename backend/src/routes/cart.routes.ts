import { Router } from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/auth";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cartController";

const router = Router();

router.get("/", authenticate, getCart);

router.post(
  "/add",
  authenticate,
  validate([
    body("productId").notEmpty().withMessage("Product ID is required"),
    body("quantity")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Quantity must be at least 1"),
  ]),
  addToCart
);

router.put(
  "/:itemId",
  authenticate,
  validate([
    body("quantity")
      .isInt({ min: 0 })
      .withMessage("Quantity must be a non-negative integer"),
  ]),
  updateCartItem
);

router.delete("/:itemId", authenticate, removeFromCart);
router.delete("/", authenticate, clearCart);

export default router;
