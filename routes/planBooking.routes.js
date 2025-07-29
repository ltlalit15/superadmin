const express = require("express");
const router = express.Router();
const bookingController = require("../controller/planBooking.controller");

router.post("/plan-booking", bookingController.createBooking);
router.get("/plan-booking", bookingController.getAllBookings);
router.put("/plan-booking/:id", bookingController.updateBooking);
router.delete("/plan-booking/:id", bookingController.deleteBooking);
router.put("/update-status/:id", bookingController.updateBookingStatus);

module.exports = router;
