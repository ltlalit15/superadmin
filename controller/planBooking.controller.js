const PlanBooking = require("../model/planBooking.model");

// ✅ Create Booking
exports.createBooking = async (req, res) => {
    try {
        const { company, email, plan, billing, date, phone } = req.body;

        if (!company || !email || !plan || !billing || !date || !phone) {
            return res.status(400).json({ msg: "All fields are required." });
        }

        const newBooking = new PlanBooking({ company, email, plan, billing, date, phone });
        await newBooking.save();

        res.status(201).json({ msg: "Booking created successfully", booking: newBooking });
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};

// ✅ Get All Bookings
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await PlanBooking.find().sort({ createdAt: -1 });

        const formatted = bookings.map((b) => ({
            ...b._doc,
            date: b.date.toISOString().split("T")[0] // Format: "YYYY-MM-DD"
        }));

        res.json(formatted);
    } catch (err) {
        res.status(500).json({ msg: "Failed to fetch bookings", error: err.message });
    }
};

// ✅ Update Booking
exports.updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await PlanBooking.findByIdAndUpdate(id, req.body, { new: true });
        if (!updated) return res.status(404).json({ msg: "Booking not found" });

        res.json({ msg: "Booking updated", booking: updated });
    } catch (err) {
        res.status(500).json({ msg: "Update failed", error: err.message });
    }
};

// ✅ Delete Booking
exports.deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await PlanBooking.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ msg: "Booking not found" });

        res.json({ msg: "Booking deleted", booking: deleted });
    } catch (err) {
        res.status(500).json({ msg: "Delete failed", error: err.message });
    }
};



exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const bookingId = req.params.id;

        if (!["Approved", "Rejected"].includes(status)) {
            return res.status(400).json({ msg: "Invalid status value" });
        }

        const updated = await PlanBooking.findByIdAndUpdate(
            bookingId,
            { status },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ msg: "Booking not found" });
        }

        res.json({ msg: `Booking ${status.toLowerCase()} successfully`, booking: updated });
    } catch (err) {
        res.status(500).json({ msg: "Error updating status", error: err.message });
    }
};
