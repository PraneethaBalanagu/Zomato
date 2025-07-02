const Restaurant = require("../models/Restaurant");
const mobilenet = require("@tensorflow-models/mobilenet");
const tf = require("@tensorflow/tfjs");
const {countries}=require('../data/countries');
const fs=require("fs");
const mongoose = require('mongoose'); 
const dishToCuisineMap = require("../data/dishToCuisineMap");
let mobilenetModel = null;
const loadModel = async () => {
  if (!mobilenetModel)  mobilenetModel = await mobilenet.load();
};

loadModel(); 
exports.getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    let restaurant = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      restaurant = await Restaurant.findById(id);
    }
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


exports.getRestaurants = async (req, res) => {
  try {
    const limit = 12;
    const lastId = req.query.lastId;
    const query = {};

    // Filter: Country
    if (req.query.country) {
      const countryEntry = countries.find(
        c => c.name.toLowerCase() === req.query.country.toLowerCase()
      );
      if (countryEntry) {
        query.countryCode = countryEntry.code;
      } else {
        return res.status(400).json({ message: "Invalid country name" });
      }
    }

    // Filter: Cost
    if (req.query.cost) {
      query.averageCostForTwo = { $lte: parseInt(req.query.cost) };
    }

    // Filter: Cuisines
    if (req.query.cuisines) {
      query.cuisines = { $regex: req.query.cuisines, $options: "i" };
    }

    // Pagination
    if (lastId) {
      try {
        query._id = { $gt: new mongoose.Types.ObjectId(lastId) };
      } catch (err) {
        return res.status(400).json({ message: "Invalid lastId" });
      }
    }

    console.log("MongoDB query:", query);

    const restaurants = await Restaurant.find(query)
      .sort({ _id: 1 }) // Ascending for pagination
      .limit(limit);

    res.json({
      restaurants,
      nextCursor: restaurants.length > 0 ? restaurants[restaurants.length - 1]._id : null,
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


 exports.searchRestaurants = async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Search query is required" });
  }

  const regex = new RegExp(q, 'i'); 
  try {
    const results = await Restaurant.find({
      $or: [
        { name: regex },
        { description: regex }
      ]
    }).limit(50);

    res.json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.getNearbyRestaurants = async (req, res) => {
  const { lat, lng, radius = 10 } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: "Latitude and longitude are required" });
  }
  const meters = parseFloat(radius) * 1000;
  try {
    const restaurants = await Restaurant.find({
      location: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: meters,
        },
      },
    });
    res.json({ restaurants });
  } catch (err) {
    console.error("Error fetching nearby restaurants:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.imageSearch = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image provided" });

    if (!req.file.mimetype.startsWith("image/")) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: "Only image files are allowed." });
    }

    const imageBuffer = fs.readFileSync(req.file.path);
    const input = tf.node.decodeImage(imageBuffer);

    await loadModel(); 
    const predictions = await mobilenetModel.classify(input);
    fs.unlinkSync(req.file.path); 

    const topLabels = predictions.map(p => p.className.toLowerCase());
    const dish = topLabels[0]?.split(",")[0].trim();  
    const cuisine = dishToCuisineMap[dish] || dish;  

    const labelRegex = new RegExp(cuisine, "i");

    const results = await Restaurant.find({ cuisines: labelRegex }).limit(20);

    res.json({
      predicted: topLabels.slice(0, 3),
      keyword: dish,
      cuisine,
      restaurants: results,
    });

  } catch (err) {
    console.error("Error in imageSearch:", err);
    res.status(500).json({ error: "Failed to process image search" });
  }
};
