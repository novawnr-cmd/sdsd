import { Router } from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validate";
import { authenticate, optionalAuth, isSeller, hasActiveSubscription } from "../middleware/auth";
import { uploadSingle, handleUploadError } from "../middleware/upload";
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  togglePause,
  getFlashDeals,
  getTrending,
  getLatest,
  getBestSellers,
  getRecommended,
  searchProducts,
} from "../controllers/productController";

const router = Router();

router.get("/", getProducts);
router.get("/search", searchProducts);
router.get("/flash-deals", getFlashDeals);
router.get("/trending", getTrending);
router.get("/latest", getLatest);
router.get("/best-sellers", getBestSellers);
router.get("/recommended", getRecommended);
router.get("/:slug", getProduct);

router.post(
  "/",
  authenticate,
  isSeller,
  hasActiveSubscription,
  uploadSingle,
  handleUploadError,
  validate([
    body("name").notEmpty().withMessage("Product name is required"),
    body("price").isFloat({ min: 0 }).withMessage("Valid price is required"),
    body("stock").isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),
    body("categoryId").notEmpty().withMessage("Category is required"),
  ]),
  createProduct
);

router.put(
  "/:id",
  authenticate,
  isSeller,
  uploadSingle,
  handleUploadError,
  updateProduct
);

router.delete("/:id", authenticate, isSeller, deleteProduct);
router.patch("/:id/toggle-pause", authenticate, isSeller, togglePause);

export default router;
