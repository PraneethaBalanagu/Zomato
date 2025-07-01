const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  restaurantId: Number,
  name: String,
  countryCode: Number,
  city: String,
  address: String,
  locality: String,
  longitude: Number,
  latitude: Number,
  cuisines: String,
  averageCostForTwo: Number,
  currency: String,
  hasTableBooking: String,
  hasOnlineDelivery: String,
  isDeliveringNow: String,
  switchToOrderMenu: String,
  priceRange: Number,
  aggregateRating: Number,
  ratingColor: String,
  ratingText: String,
  votes: Number,
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required:true,
      
    },
    coordinates: {
      type: [Number], 
      required: true,
    },
  },
});
restaurantSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Restaurant", restaurantSchema);
