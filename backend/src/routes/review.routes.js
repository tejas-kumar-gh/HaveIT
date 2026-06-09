const express = require("express");
const { createReview } = require("../controllers/review.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", authMiddleware, createReview);

module.exports = router;
