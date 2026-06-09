const Request = require("../models/Request");
const Trip = require("../models/Trip");
const User = require("../models/User");

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

// Update request status (accept/reject/pickup)
exports.updateRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;
    
    if (!['accepted', 'rejected', 'picked_up'].includes(status)) {
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
    if (status === 'picked_up') {
      // Generate random 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      request.deliveryOTP = otp;
    }
    await request.save();
    
    // If accepted, update trip capacity
    if (status === 'accepted') {
      trip.totalDeliveredItems = (trip.totalDeliveredItems || 0) + request.quantity;
      await trip.save();
    }
    
    res.json({ message: `Request status updated to ${status} successfully`, request });
  } catch (err) {
    console.error('Error updating request:', err);
    res.status(500).json({ message: err.message });
  }
};

// Verify Delivery OTP (for carrier to finalize delivery)
exports.verifyDeliveryOTP = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }

    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Check if user is the carrier of the trip
    const trip = await Trip.findById(request.tripId);
    if (!trip || trip.carrierId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (request.status !== 'picked_up') {
      return res.status(400).json({ message: "Item must be in 'picked_up' status to verify delivery" });
    }

    if (request.deliveryOTP !== otp.trim()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Update status to delivered and clean up OTP
    request.status = 'delivered';
    request.deliveryOTP = undefined;
    await request.save();

    // Increment carrier's totalDeliveries
    const carrier = await User.findById(req.user.id);
    if (carrier) {
      carrier.totalDeliveries = (carrier.totalDeliveries || 0) + 1;
      await carrier.save();
    }

    res.json({ message: "Delivery verified and completed successfully!", request });
  } catch (err) {
    console.error("Error verifying OTP:", err);
    res.status(500).json({ message: err.message });
  }
};
// sending all users requests
exports.getAllCarrierRequests = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // find trips owned by carrier
    const trips = await Trip.find({ carrierId: req.user.id }).select("_id");

    const tripIds = trips.map(t => t._id);

    const total = await Request.countDocuments({ tripId: { $in: tripIds } });

    const requests = await Request.find({ tripId: { $in: tripIds } })
      .populate("tripId", "fromCity toCity departureDate")
      .populate("demanderId", "name email phone rating")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      requests,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Error fetching all requests:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get single request details (for carrier view)
exports.getRequestById = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await Request.findById(requestId)
      .populate("tripId", "fromCity toCity departureDate capacity carrierId")
      .populate("demanderId", "name email phone rating");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Authorization: only carrier of this trip can view
    if (request.tripId.carrierId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json({ request });
  } catch (err) {
    console.error("Error fetching request:", err);
    res.status(500).json({ message: err.message });
  }
};


// Get requests made by current demander
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ demanderId: req.user.id })
      .populate({
        path: "tripId",
        select: "fromCity toCity departureDate departureTime capacity totalDeliveredItems",
        populate: { path: "carrierId", select: "name email phone" }
      })
      .populate({ path: "carrierId", select: "name email phone" })
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getAcceptedRequests = async (req, res) => {
  try {
    // Find accepted requests for trips of this carrier
    const requests = await Request.find({ 
      status: 'accepted' 
    })
    .populate({
      path: 'tripId',
      match: { carrierId: req.user.id }, // only this carrier's trips
      select: 'fromCity toCity departureDate'
    })
    .populate('demanderId', 'name email phone')
    .lean();

    // filter out requests that don't belong to this carrier (tripId could be null due to match)
    const filteredRequests = requests.filter(r => r.tripId);

    res.json({ requests: filteredRequests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};