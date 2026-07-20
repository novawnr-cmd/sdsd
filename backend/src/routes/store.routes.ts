import { Router } from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validate";
import { authenticate, isSeller } from "../middleware/auth";
import {
  createStore,
  getMyStore,
  updateStore,
  getStoreBySlug,
} from "../controllers/storeController";

const router = Router();

router.get("/my", authenticate, isSeller, getMyStore);

router.post(
  "/",
  authenticate,
  validate([
    body("name").notEmpty().withMessage("Store name is required"),
    body("phone").notEmpty().withMessage("Phone number is required"),
  ]),
  createStore
);

router.put(
  "/",
  authenticate,
  isSeller,
  validate([
    body("name").optional().notEmpty().withMessage("Store name cannot be empty"),
  ]),
  updateStore
);

router.get("/:slug", getStoreBySlug);

export default router;
