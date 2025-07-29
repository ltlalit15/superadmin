const Plan = require("../model/Plan");

exports.createPlan = async (req, res) => {
    try {
        const plan = await Plan.create(req.body);
        res.status(201).json({ success: true, data: plan });
    } catch {
        res.status(500).json({ success: false, message: "Plan creation failed" });
    }
};

exports.getPlans = async (req, res) => {
    try {
        const plans = await Plan.find();
        res.json({ success: true, data: plans });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch plans", error: error.message });
    }
};


exports.updatePlan = async (req, res) => {
    try {
        const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, data: plan });
    } catch {
        res.status(500).json({ success: false, message: "Plan update failed" });
    }
};

exports.deletePlan = async (req, res) => {
    try {
        await Plan.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Plan deleted" });
    } catch {
        res.status(500).json({ success: false, message: "Plan deletion failed" });
    }
};

// GET: Only Active Plans (For frontend/public users)
exports.getActivePlans = async (req, res) => {
    try {
        const plans = await Plan.find({ status: "Active" }); // 👈 only active plans
        res.json({ success: true, data: plans });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch plans", error: error.message });
    }
};


// Toggle Plan Status by ID
exports.UpdatePlanStatus = async (req, res) => {
    const { id } = req.params;

    try {
        const plan = await Plan.findById(id);
        if (!plan) {
            return res.status(404).json({ success: false, message: "Plan not found" });
        }

        // Toggle status
        plan.status = plan.status === "Active" ? "Inactive" : "Active";
        await plan.save();

        res.json({
            success: true,
            message: `Plan status updated to ${plan.status}`,
            data: plan
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error toggling plan status", error: error.message });
    }
};
