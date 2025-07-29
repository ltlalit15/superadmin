const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");

// ✅ Import multer middleware
const upload = require("../middlewares/upload.middleware");

// ✅ Create User with avatar upload
router.post("/", upload.single("avatar"), userController.createUser);

// ✅ Get all users
router.get("/", userController.getUsers);

// ✅ Update user with new avatar
router.put("/:id", upload.single("avatar"), userController.updateUser);

// ✅ Delete user
router.delete("/:id", userController.deleteUser);

module.exports = router;
