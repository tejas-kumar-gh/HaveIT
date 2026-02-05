const express = require("express");
const {
  createRequest,
  checkRequest,
  getTripRequests,
  updateRequestStatus,
  getAllCarrierRequests,
  getRequestById,
  getMyRequests,
  getAcceptedRequests
} = require("../controllers/request.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", authMiddleware, createRequest);
router.get("/all-request", authMiddleware, getAllCarrierRequests);
// Get all requests of current demander
router.get("/my-requests", authMiddleware, getMyRequests);
router.get('/accepted', authMiddleware, getAcceptedRequests);
router.get("/check/:tripId", authMiddleware, checkRequest);
router.get("/trip/:tripId", authMiddleware, getTripRequests);
router.put("/:requestId/status", authMiddleware, updateRequestStatus);

router.get("/:requestId", authMiddleware, getRequestById);

module.exports = router;
