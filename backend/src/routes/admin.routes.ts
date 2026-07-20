import { Router } from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validate";
import { authenticate, isAdmin } from "../middleware/auth";
import {
  getDashboardStats,
  getUsers,
  getSellers,
  getProducts,
  getOrders,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getReviews,
  approveReview,
  deleteReview,
  getCoupons,
  getSubscriptions,
  createFlashDeal,
  deleteFlashDeal,
  createBanner,
  updateBanner,
  deleteBanner,
  getBanners,
  updateSiteSettings,
  getSiteSettings,
  getAnalytics,
  adminUpdateOrderStatus,
  toggleStoreActive,
  deleteUser,
  toggleUserVerification,
} from "../controllers/adminController";

const router = Router();

router.use(authenticate, isAdmin);

router.get("/dashboard", getDashboardStats);
router.get("/analytics", getAnalytics);

// Users
router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id/verify", toggleUserVerification);

// Sellers
router.get("/sellers", getSellers);
router.patch("/sellers/:id/toggle-active", toggleStoreActive);

// Products
router.get("/products", getProducts);

// Orders
router.get("/orders", getOrders);
router.patch(
  "/orders/:id/status",
  validate([
    body("status")
      .isIn(["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"])
      .withMessage("Invalid order status"),
  ]),
  adminUpdateOrderStatus
);

// Categories
router.get("/categories", getCategories);
router.post(
  "/categories",
  validate([body("name").notEmpty().withMessage("Category name is required")]),
  createCategory
);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

// Reviews
router.get("/reviews", getReviews);
router.patch("/reviews/:id/approve", approveReview);
router.delete("/reviews/:id", deleteReview);

// Coupons
router.get("/coupons", getCoupons);

// Subscriptions
router.get("/subscriptions", getSubscriptions);

// Flash Deals
router.post(
  "/flash-deals",
  validate([
    body("productId").notEmpty().withMessage("Product ID is required"),
    body("discount").isFloat({ min: 1, max: 99 }).withMessage("Discount must be between 1 and 99"),
    body("startTime").isISO8601().withMessage("Valid start time is required"),
    body("endTime").isISO8601().withMessage("Valid end time is required"),
  ]),
  createFlashDeal
);
router.delete("/flash-deals/:id", deleteFlashDeal);

// Banners
router.get("/banners", getBanners);
router.post(
  "/banners",
  validate([
    body("image").notEmpty().withMessage("Image URL is required"),
  ]),
  createBanner
);
router.put("/banners/:id", updateBanner);
router.delete("/banners/:id", deleteBanner);

// Site Settings
router.get("/settings", getSiteSettings);
router.put(
  "/settings",
  validate([body("settings").isArray().withMessage("Settings must be an array")]),
  updateSiteSettings
);

export default router;
