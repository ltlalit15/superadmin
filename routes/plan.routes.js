const express = require("express");
const router = express.Router();
const planController = require("../controller/plan.controller");

router.post("/plan", planController.createPlan);
router.get("/plan", planController.getPlans);
router.put("/plan/:id", planController.updatePlan);
router.delete("/plan/:id", planController.deletePlan);
router.get("/plans/active", planController.getActivePlans);
router.put("/plans/:id/toggle-status", planController.UpdatePlanStatus);
module.exports = router;
