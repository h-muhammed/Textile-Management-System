const express = require("express");
const router = express.Router();

const UserProfileController = require("../Controllers/UserProfileController");

router.get("/", UserProfileController.getProfile);
router.get("/:id", UserProfileController.getUserById);
router.put("/", UserProfileController.updateProfile);
router.put("/:id", UserProfileController.updateUserById);

module.exports = router;
