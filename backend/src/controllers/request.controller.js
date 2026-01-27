const Request = require("../models/Request");
const Trip = require("../models/Trip");
const User = require("../models/User");

// Post a new request (Item Demander)
exports.createRequest = async (req, res) => {
  try {
    const { tripId, itemName, itemType, quantity, phone, email, price } = req.body;

    if (!itemName || !itemType || !quantity || !phone || !email || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Optional: check if itemType is allowed in the trip
    if (tripId) {
      const trip = await Trip.findById(tripId);
      if (trip && !trip.allowedItemTypes.includes(itemType)) {
        return res.status(400).json({ message: "Item type not allowed in this trip" });
      }
    }

    const request = await Request.create({
      demanderId: req.user.id,
      tripId,
      itemName,
      itemType,
      quantity,
      phone,
      email,
      price
    });

    res.status(201).json({ message: "Request posted", request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all requests (for Carriers)
exports.getRequests = async (req, res) => {
  try {
    const requests = await Request.find({ status: "pending" })
      .populate("demanderId", "-password")
      .populate("tripId");

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Accept or Reject a request (Carrier)
exports.respondRequest = async (req, res) => {
  try {
    const { requestId, action } = req.body; // action = 'accepted' or 'rejected'

    if (!requestId || !["accepted", "rejected"].includes(action)) {
      return res.status(400).json({ message: "Invalid request or action" });
    }

    const request = await Request.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = action;
    if (action === "accepted") request.carrierId = req.user.id;

    await request.save();

    res.json({ message: `Request ${action}`, request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Item Demander sees all their requests
exports.myRequests = async (req, res) => {
  try {
    const requests = await Request.find({ demanderId: req.user.id })
      .populate("carrierId", "-password")
      .populate("tripId");

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.respondRequest = async (req, res) => {
  try {
    const { requestId, action } = req.body;

    if (!requestId || !["accepted", "rejected"].includes(action)) {
      return res.status(400).json({ message: "Invalid request or action" });
    }

    const request = await Request.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = action;
    if (action === "accepted") {
      request.carrierId = req.user.id;

      // Update Trip delivered count if trip exists
      if (request.tripId) {
        await Trip.findByIdAndUpdate(request.tripId, {
          $inc: { totalDeliveredItems: request.quantity }
        });
      }

      // Update Carrier totalDeliveries
      await User.findByIdAndUpdate(req.user.id, {
        $inc: { totalDeliveries: request.quantity }
      });
    }

    await request.save();

    res.json({ message: `Request ${action}`, request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
