const express = require("express");
const router = express.Router();

const myUserControl = require("../../controllers/api/myusersController");

router.post("/signup", myUserControl.create);
router.post("/login", myUserControl.login);
router.get("/index", myUserControl.index);

router.patch("/getUserDetails", myUserControl.getUserDetails);

router.delete("/delete", myUserControl.deleteUser);
router.patch("/updateUserLevel", myUserControl.updateUserLevel);

router.patch("/patchViewer", myUserControl.patchViewer);
router.patch("/getViewer", myUserControl.getViewer);

module.exports = router;