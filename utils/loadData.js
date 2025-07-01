const mongoose = require("mongoose");
const csv = require("csvtojson");
require("dotenv").config();

const Restaurant = require("../models/Restaurant");

mongoose.connect(process.env.MONGO_URI);


const loadData = async () => {
  const data = await csv().fromFile("./data/zomato.csv");

  const transformed = data.map((item) => ({
    restaurantId: parseInt(item["Restaurant ID"]),
    name: item["Restaurant Name"],
    countryCode: parseInt(item["Country Code"]),
    city: item["City"],
    address: item["Address"],
    locality: item["Locality"],
    longitude: parseFloat(item["Longitude"]),
    latitude: parseFloat(item["Latitude"]),
    cuisines: item["Cuisines"],
    averageCostForTwo: parseFloat(item["Average Cost for two"]),
    currency: item["Currency"],
    hasTableBooking: item["Has Table booking"],
    hasOnlineDelivery: item["Has Online delivery"],
    isDeliveringNow: item["Is delivering now"],
    switchToOrderMenu: item["Switch to order menu"],
    priceRange: parseInt(item["Price range"]),
    aggregateRating: parseFloat(item["Aggregate rating"]),
    ratingColor: item["Rating color"],
    ratingText: item["Rating text"],
    votes: parseInt(item["Votes"]),
  }));

  await Restaurant.insertMany(transformed);
  console.log("✅ Data loaded successfully");
  mongoose.disconnect();
};

loadData();
