const express = require("express");
const router = express.Router();

const mapQuery = require("../../controllers/api/searchMapController")

router.get("/getResult/:query", mapQuery.searchPlaces);
router.get("/getDetailResult/:query", mapQuery.searchDetails);

module.exports = router;