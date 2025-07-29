const Admin = require("../model/Admin");
const PlanBooking = require("../model/planBooking.model");
const Plan = require("../model/Plan"); // if you have a Plan model



exports.getDashboardSummary = async (req, res) => {
    try {
        const totalUsers = await Admin.countDocuments();
        const totalPlans = await Plan.countDocuments();
        const totalEnquiries = await PlanBooking.countDocuments();

        // ✅ Get Today's Date Range
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todayPlans = await Plan.countDocuments({
            createdAt: { $gte: today, $lt: tomorrow }
        });

        res.json({
            totalUsers,
            totalPlans,
            todayPlans,
            totalEnquiries
        });

    } catch (err) {
        res.status(500).json({ msg: "Failed to fetch dashboard data", error: err.message });
    }
};



// {
//     "totalUsers": 5,
//     "totalPlans": 4,
//     "totalEnquiries": 6
// }