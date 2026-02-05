const Trip = require("../models/Trip");
const Request = require("../models/Request");

// Create Trip
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
      fromCity: fromCity.trim(),
      toCity: toCity.trim(),
      departureDate: new Date(departureDate + "T" + departureTime),
      departureTime,
      arrivalDate: new Date(arrivalDate + "T" + arrivalTime),
      arrivalTime,
      capacity,
      allowedItemTypes,
      pickupLocation,
      dropLocation
    });

    res.status(201).json({ message: "Trip posted successfully", trip });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Trips (Search)
exports.getTrips = async (req, res) => {
  try {
    const { fromCity, toCity, date, page = 1, limit = 5 } = req.query;

    let filter = {};

    if (fromCity) filter.fromCity = { $regex: fromCity.trim(), $options: "i" };
    if (toCity) filter.toCity = { $regex: toCity.trim(), $options: "i" };

    if (date) {
      const start = new Date(date);
      start.setUTCHours(0, 0, 0, 0);

      const end = new Date(date);
      end.setUTCHours(23, 59, 59, 999);

      filter.departureDate = { $gte: start, $lte: end };
    }

    const skip = (page - 1) * limit;

    const totalTrips = await Trip.countDocuments(filter);
    const trips = await Trip.find(filter)
      .populate("carrierId", "-password")
      .skip(skip)
      .limit(Number(limit));

    res.json({
      trips,
      currentPage: Number(page),
      totalPages: Math.ceil(totalTrips / limit),
      totalTrips
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get My Trips
// Get trips posted by the current user with pagination + requests
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
      .populate("carrierId", "name email phone rating")
      .lean(); // convert to plain JS object

    // ✅ Attach requests for each trip
    const tripIds = trips.map(t => t._id);
    const requests = await Request.find({ tripId: { $in: tripIds } })
      .populate("demanderId", "name email phone")
      .lean();

    const tripsWithRequests = trips.map(trip => ({
      ...trip,
      requests: requests.filter(r => r.tripId.toString() === trip._id.toString())
    }));

    res.json({
      trips: tripsWithRequests,
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


// Delete Trip
exports.deleteTrip = async (req, res) => {
  try {
    const tripId = req.params.id;
    const trip = await Trip.findById(tripId);

    if (!trip) return res.status(404).json({ message: "Trip not found" });
    if (trip.carrierId.toString() !== req.user.id) return res.status(403).json({ message: "Not authorized" });

    const hasRequests = await Request.countDocuments({ 
      tripId: tripId,
      status: { $in: ['accepted', 'pending'] }
    });

    if (hasRequests > 0) return res.status(400).json({ message: "Cannot delete trip with pending or accepted requests" });

    await Trip.findByIdAndDelete(tripId);
    res.json({ message: "Trip deleted successfully" });
  } catch (err) {
    console.error('Error deleting trip:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get Trip by ID

exports.getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate("carrierId", "name email phone rating");

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // ✅ MUST return as { trip }
    res.status(200).json({ trip });

  } catch (err) {
    console.error("Error fetching trip:", err);
    res.status(500).json({ message: err.message });
  }
};
