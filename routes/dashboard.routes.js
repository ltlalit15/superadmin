const express = require("express");
const router = express.Router();
const dashboardController = require("../controller/dashboard.controller");
const ActivityController = require("../controller/activity.controller");

router.get("/super-admin-dashboard", dashboardController.getDashboardSummary);
router.get('/recent-activities', ActivityController.getRecentActivities);
module.exports = router;
