const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  demanderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: "Trip" }, // optional if route matches
  itemName: { type: String, required: true },
  itemType: { type: String, required: true },
  quantity: { type: Number, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  status: { type: String, enum: ["pending", "accepted", "rejected", "picked_up", "delivered"], default: "pending" },
  deliveryOTP: { type: String },
  isReviewed: { type: Boolean, default: false },
  carrierId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // who accepted
}, { timestamps: true });

module.exports = mongoose.model("Request", requestSchema);
