import { Router } from "express";
import { searchLimiter } from "../middleware/rateLimiter";
import { liveSearch, getSearchSuggestions } from "../controllers/searchController";

const router = Router();

router.get("/", searchLimiter, liveSearch);
router.get("/suggestions", searchLimiter, getSearchSuggestions);

export default router;
