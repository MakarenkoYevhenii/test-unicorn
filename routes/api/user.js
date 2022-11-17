const express = require("express");

const router = express.Router();
const controller = require("../../controller/user.js");
const auth = require("../../middelwares/auth.js");

router.post("/signup", controller.signup);
router.post("/signin", controller.signin);
router.get("/info", auth, controller.current);
router.get("/logout", auth, controller.logout);

module.exports = router;
