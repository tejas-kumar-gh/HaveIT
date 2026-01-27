const Trip = require("../models/Trip");

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
    const { fromCity, toCity } = req.query;
    let filter = {};
    if (fromCity) filter.fromCity = fromCity;
    if (toCity) filter.toCity = toCity;

    const trips = await Trip.find(filter).populate("carrierId", "-password");
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
