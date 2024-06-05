const express = require("express");
const router = express.Router();

const mapControl = require("../../controllers/api/mapController");

router.get("/getJSON/:id", mapControl.index);


module.exports = router;