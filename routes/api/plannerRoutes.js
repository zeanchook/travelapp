const express = require("express");
const router = express.Router();

const plannerController = require("../../controllers/api/plannerController");
router.post("/create", plannerController.create);
router.get("/get", plannerController.index);

module.exports = router;