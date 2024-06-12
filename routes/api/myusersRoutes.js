const express = require("express");
const router = express.Router();

const myUserControl = require("../../controllers/api/myusersController");
const usertype = require("../../config/usertype");

router.post("/signup", myUserControl.create);
router.post("/login", myUserControl.login);
router.get("/index", myUserControl.index);

router.patch("/getUserDetails", myUserControl.getUserDetails);

router.delete("/delete", [usertype] ,myUserControl.deleteUser);
router.patch("/updateUserLevel", [usertype] ,myUserControl.updateUserLevel);

router.patch("/patchViewer", myUserControl.patchViewer);
router.patch("/getViewer", myUserControl.getViewer);

module.exports = router;