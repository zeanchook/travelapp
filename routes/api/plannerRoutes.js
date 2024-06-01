const express = require("express");
const router = express.Router();

const plannerController = require("../../controllers/api/plannerController");
router.post("/create", plannerController.create);
router.get("/get", plannerController.index);
router.get("/getDetails/:id",plannerController.getDetails);

router.post("/add/:planneritemsid/itinerary",plannerController.addtoItinerary);

module.exports = router;