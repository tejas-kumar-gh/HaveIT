const express = require("express");
const { createRequest, getRequests, respondRequest ,myRequests} = require("../controllers/request.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// Item Demander posts request
router.post("/", authMiddleware, createRequest);

// Carriers view pending requests
router.get("/", authMiddleware, getRequests);

// Carrier responds (accept/reject)
router.post("/respond", authMiddleware, respondRequest);

router.get("/my", authMiddleware, myRequests);

module.exports = router;
