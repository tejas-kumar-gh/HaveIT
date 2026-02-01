const Trip = require("../models/Trip");
const Request = require("../models/Request"); // Add this import

exports.createTrip = async (req, res) => {
  try {
    const {
      fromCity, toCity,
      departureDate, departureTime,
      arrivalDate, arrivalTime,
      capacity, allowedItemTypes,
      pickupLocation, dropLocation
    } = req.body;

    if (!fromCity || !toCity || !departureDate || !departureTime || !arrivalDate || !arrivalTime || !capacity) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const trip = await Trip.create({
      carrierId: req.user.id,
      fromCity, toCity,
      departureDate, departureTime,
      arrivalDate, arrivalTime,
      capacity,
      allowedItemTypes,
      pickupLocation, dropLocation
    });

    res.status(201).json({ message: "Trip posted successfully", trip });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTrips = async (req, res) => {
  try {
    const { fromCity, toCity, date } = req.query;

    let filter = {};

    if (fromCity) {
      filter.fromCity = { $regex: new RegExp(`^${fromCity}$`, "i") };
    }

    if (toCity) {
      filter.toCity = { $regex: new RegExp(`^${toCity}$`, "i") };
    }

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      filter.departureDate = { $gte: start, $lte: end };
    }

    const trips = await Trip.find(filter)
      .populate("carrierId", "-password");

    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get trips posted by the current user with pagination
exports.getMyTrips = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const totalTrips = await Trip.countDocuments({ carrierId: req.user.id });
    const totalPages = Math.ceil(totalTrips / limit);

    const trips = await Trip.find({ carrierId: req.user.id })
      .sort({ departureDate: 1 })
      .skip(skip)
      .limit(limit)
      .populate("carrierId", "name email phone rating");

    res.json({
      trips,
      currentPage: page,
      totalPages,
      totalTrips,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    });
  } catch (err) {
    console.error('Error fetching user trips:', err);
    res.status(500).json({ message: err.message });
  }
};

// Delete a trip (only if user owns it)
exports.deleteTrip = async (req, res) => {
  try {
    const tripId = req.params.id;
    
    // Find the trip first
    const trip = await Trip.findById(tripId);
    
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    
    // Check if the current user owns this trip
    if (trip.carrierId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this trip" });
    }
    
    // Check if trip has any accepted requests
    const hasRequests = await Request.countDocuments({ 
      tripId: tripId,
      status: { $in: ['accepted', 'pending'] }
    });
    
    if (hasRequests > 0) {
      return res.status(400).json({ 
        message: "Cannot delete trip with pending or accepted delivery requests" 
      });
    }
    
    // Delete the trip
    await Trip.findByIdAndDelete(tripId);
    
    res.json({ message: "Trip deleted successfully" });
  } catch (err) {
    console.error('Error deleting trip:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get single trip by ID
exports.getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate("carrierId", "name email phone rating");
    
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    
    res.json(trip);
  } catch (err) {
    console.error('Error fetching trip:', err);
    res.status(500).json({ message: err.message });
  }
};