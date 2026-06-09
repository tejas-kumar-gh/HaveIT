const Review = require("../models/Review");
const User = require("../models/User");
const Request = require("../models/Request");

exports.createReview = async (req, res) => {
  try {
    const { revieweeId, requestId, rating, comment } = req.body;
    const reviewerId = req.user.id;

    if (!revieweeId || !requestId || !rating) {
      return res.status(400).json({ message: "Reviewee ID, request ID, and rating are required." });
    }

    // Check if user already reviewed this request
    const existingReview = await Review.findOne({ reviewerId, requestId });
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this delivery." });
    }

    const review = await Review.create({
      reviewerId,
      revieweeId,
      requestId,
      rating: Number(rating),
      comment
    });

    // Mark request as reviewed
    await Request.findByIdAndUpdate(requestId, { isReviewed: true });

    // Calculate new average rating for reviewee
    const reviews = await Review.find({ revieweeId });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = (totalRating / reviews.length).toFixed(1);

    await User.findByIdAndUpdate(revieweeId, { rating: Number(averageRating) });

    res.status(201).json({ message: "Review submitted successfully", review });
  } catch (err) {
    console.error("Error creating review:", err);
    res.status(500).json({ message: err.message });
  }
};
