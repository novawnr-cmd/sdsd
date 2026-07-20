import { Router } from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validate";
import { authenticate, isAdmin } from "../middleware/auth";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";

const router = Router();

router.get("/", getCategories);

router.post(
  "/",
  authenticate,
  isAdmin,
  validate([body("name").notEmpty().withMessage("Category name is required")]),
  createCategory
);

router.put("/:id", authenticate, isAdmin, updateCategory);
router.delete("/:id", authenticate, isAdmin, deleteCategory);

export default router;
