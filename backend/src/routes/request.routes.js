// This should be your request.routes.js file structure:
const express = require("express");
const { 
  createRequest, 
  checkRequest, 
  getTripRequests,
  updateRequestStatus 
} = require("../controllers/request.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

router.post("/", authMiddleware, createRequest);
router.get("/check/:tripId", authMiddleware, checkRequest);
router.get("/trip/:tripId", authMiddleware, getTripRequests);
router.put("/:requestId/status", authMiddleware, updateRequestStatus);

module.exports = router;