import { Router } from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/auth";
import {
  toggleWishlist,
  getWishlist,
} from "../controllers/wishlistController";

const router = Router();

router.get("/", authenticate, getWishlist);

router.post(
  "/toggle",
  authenticate,
  validate([
    body("productId").notEmpty().withMessage("Product ID is required"),
  ]),
  toggleWishlist
);

export default router;
