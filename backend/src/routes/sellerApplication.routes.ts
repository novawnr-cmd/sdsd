import { Router } from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validate";
import { authenticate, isAdmin } from "../middleware/auth";
import {
  submitApplication,
  getApplications,
  approveApplication,
  rejectApplication,
} from "../controllers/sellerApplicationController";

const router = Router();

router.post(
  "/",
  authenticate,
  validate([
    body("storeName").notEmpty().withMessage("Store name is required"),
    body("phone").notEmpty().withMessage("Phone number is required"),
    body("city").notEmpty().withMessage("City is required"),
  ]),
  submitApplication
);

router.get("/", authenticate, isAdmin, getApplications);
router.patch("/:id/approve", authenticate, isAdmin, approveApplication);
router.patch(
  "/:id/reject",
  authenticate,
  isAdmin,
  validate([body("reason").optional().isString()]),
  rejectApplication
);

export default router;
