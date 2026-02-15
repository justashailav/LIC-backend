import express from "express";
import { createPlan, deletePlan, getAllPlans, getPlanBySlug, getPopularPlans, updatePlan } from "../controllers/planCategoryController.js";

const router = express.Router();
router.get("/plan-categories", getAllPlans);
router.get("/plan-categories/popular", getPopularPlans);
router.get("/plan-categories/:slug", getPlanBySlug);
router.post("/admin/plan-categories", createPlan);
router.put("/admin/plan-categories/:id", updatePlan);
router.delete("/admin/plan-categories/:id", deletePlan);

export default router;
