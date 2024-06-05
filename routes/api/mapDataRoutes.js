const express = require("express");
const router = express.Router();

const mapControl = require("../../controllers/api/mapController");

router.get("/getJSON/:id", mapControl.index);
router.get("/getJSONByUser/:id", mapControl.indexByName);


module.exports = router;