const Request = require("../models/Request");
const Trip = require("../models/Trip");

// Create delivery request
exports.createRequest = async (req, res) => {
  try {
    const { tripId, itemName, itemType, quantity, phone, email, price } = req.body;
    
    if (!tripId || !itemName || !itemType || !quantity || !phone || !email || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    // Check if trip exists
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    
    // Check if user already requested this trip
    const existingRequest = await Request.findOne({
      tripId: tripId,
      demanderId: req.user.id,
      status: { $in: ['pending', 'accepted'] }
    });
    
    if (existingRequest) {
      return res.status(400).json({ message: "You have already requested this trip" });
    }
    
    // Check if trip has capacity
    const availableCapacity = trip.capacity - (trip.totalDeliveredItems || 0);
    if (availableCapacity < quantity) {
      return res.status(400).json({ 
        message: `Trip only has ${availableCapacity} spots available` 
      });
    }
    
    // Create request
    const request = await Request.create({
      tripId,
      demanderId: req.user.id,
      itemName,
      itemType,
      quantity: parseInt(quantity),
      phone,
      email,
      price: parseFloat(price)
    });
    
    res.status(201).json({ message: "Delivery request sent successfully", request });
  } catch (err) {
    console.error('Error creating request:', err);
    res.status(500).json({ message: err.message });
  }
};

// Check if user has requested a trip
exports.checkRequest = async (req, res) => {
  try {
    const request = await Request.findOne({
      tripId: req.params.tripId,
      demanderId: req.user.id,
      status: { $in: ['pending', 'accepted'] }
    });
    
    res.json({ requested: !!request });
  } catch (err) {
    console.error('Error checking request:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get requests for a trip (for carrier to see responses)
exports.getTripRequests = async (req, res) => {
  try {
    const tripId = req.params.tripId;
    
    // Check if trip belongs to user
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    
    if (trip.carrierId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to view these requests" });
    }
    
    const requests = await Request.find({ tripId: tripId })
      .populate("demanderId", "name email phone rating")
      .sort({ createdAt: -1 });
    
    res.json(requests);
  } catch (err) {
    console.error('Error fetching trip requests:', err);
    res.status(500).json({ message: err.message });
  }
};

// Update request status (accept/reject)
exports.updateRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;
    
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    
    // Check if user owns the trip
    const trip = await Trip.findById(request.tripId);
    if (!trip || trip.carrierId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    // Update request status
    request.status = status;
    if (status === 'accepted') {
      request.carrierId = req.user.id;
    }
    await request.save();
    
    // If accepted, update trip capacity
    if (status === 'accepted') {
      trip.totalDeliveredItems = (trip.totalDeliveredItems || 0) + request.quantity;
      await trip.save();
    }
    
    res.json({ message: `Request ${status} successfully`, request });
  } catch (err) {
    console.error('Error updating request:', err);
    res.status(500).json({ message: err.message });
  }
};