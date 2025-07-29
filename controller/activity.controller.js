const Activity = require("../model/Plan");
const Admin = require("../model/Admin");
const moment = require("moment");

exports.getRecentActivities = async (req, res) => {
    try {
        const activities = await Activity.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate("_id", "status"); // get user status  
        const admin = await Admin.findOne();

        const result = activities.map((activity) => ({
            activityId: activity._id?._id || null,
            type: activity.description,
            status: admin?.status || "Unknown",
            date: moment(activity.createdAt).fromNow()
        }));

        res.json({ success: true, data: result });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Error fetching recent activities", error: err.message });
    }
};
