// This should be your trip.routes.js file structure:
const express = require("express");
const { 
  createTrip, 
  getTrips, 
  getMyTrips,
  deleteTrip,
  getTripById 
} = require("../controllers/trip.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

router.post("/", authMiddleware, createTrip);
router.get("/", authMiddleware, getTrips);
router.get("/my-trips", authMiddleware, getMyTrips);
router.delete("/:id", authMiddleware, deleteTrip);
router.get("/:id", authMiddleware, getTripById);

module.exports = router;