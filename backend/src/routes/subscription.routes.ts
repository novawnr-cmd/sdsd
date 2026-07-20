import { Router } from "express";
import { authenticate } from "../middleware/auth";
import {
  createSubscription,
  getMySubscription,
} from "../controllers/subscriptionController";

const router = Router();

router.get("/my", authenticate, getMySubscription);
router.post("/", authenticate, createSubscription);

export default router;
