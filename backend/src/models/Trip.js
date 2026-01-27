const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  carrierId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fromCity: { type: String, required: true },
  toCity: { type: String, required: true },
  departureDate: { type: Date, required: true },
  departureTime: { type: String, required: true },
  arrivalDate: { type: Date, required: true },
  arrivalTime: { type: String, required: true },
  capacity: { type: Number, required: true },
  allowedItemTypes: [{ type: String }],
  pickupLocation: { type: String },
  dropLocation: { type: String },
  totalDeliveredItems: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Trip", tripSchema);
