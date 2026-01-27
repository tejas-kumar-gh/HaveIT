const express = require("express");
const { createTrip, getTrips } = require("../controllers/trip.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

router.post("/", authMiddleware, createTrip);
router.get("/", authMiddleware, getTrips);

module.exports = router;
