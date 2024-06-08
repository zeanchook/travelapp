const express = require("express");
const router = express.Router();

const plannerController = require("../../controllers/api/plannerController");
// create a new planner
router.post("/create", plannerController.create);

// get list of planner by user id 
router.get("/get", plannerController.index);

// get list of days in a planner by user id 
router.get("/getDetails/:id",plannerController.getDetails);

// get list of each of items in each day of planner by user id 
router.get("/getEachDetails/:id",plannerController.getEachDetails);

//add item into a day of itinerary
router.post("/add/:planneritemsid/itinerary",plannerController.addtoItinerary);

//patch the ordering of a Day itinerary
router.patch("/update/order",plannerController.patchItinerary);

//patch itenerary to move between days
router.patch("/update/itinerary",plannerController.patchDaysItinerary);

//delete a planner 
router.delete("/delete/planner/:id",plannerController.deletePlanner);

// patch/set a trip status => completed
router.patch("/update/planner/:id",plannerController.patchPlanner);

// for retrieving stats of heatmap stats and list of planner and views for ltr.
router.patch("/getUserStats",plannerController.getUserPlannerStats);

router.get("/getStats",plannerController.getAllPlannerStats);

//delete itinerary item
router.delete("/delete/itineraryitems/:id",plannerController.deleteItineraryItem);

router.get("/testing",plannerController.testing);

module.exports = router;