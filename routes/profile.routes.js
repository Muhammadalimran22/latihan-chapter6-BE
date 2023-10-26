const router = require("express").Router();
const {
  authenticate,
  createProfile,
} = require("../controllers/profile.controllers");
const { image } = require("../libs/multer");

router.post("/update-profile", image.single("profile_picture"), createProfile);
router.get("/authenticate", authenticate);
module.exports = router;
