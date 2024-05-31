const express = require("express");
const router = express.Router();

const myUserControl = require("../../controllers/api/myusersController");

router.post("/signup", myUserControl.create);
router.post("/login", myUserControl.login);

module.exports = router;