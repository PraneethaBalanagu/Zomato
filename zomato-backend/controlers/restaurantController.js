const Restaurant = require("../models/Restaurant");
const mobilenet = require("@tensorflow-models/mobilenet");
const tf = require("@tensorflow/tfjs");
const {countries}=require('../data/countries');
const fs=require("fs");
const mongoose = require('mongoose'); 
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
    const page = parseInt(req.query.page) || 1;
    const limit = 12;
    const skip = (page - 1) * limit;
    const query = {};
    if (req.query.country) {
      const countryEntry= countries.find(c=> c.name.toLowerCase()==req.query.country.toLowerCase());
      if(countryEntry) query.countryCode= countryEntry.code;
      else return res.status(400).json({message:"Invalid country name"});
    }

    if (req.query.cost) {
      query.averageCostForTwo = { $lte: parseInt(req.query.cost) };
    }

    if (req.query.cuisines) {
      query.cuisines = { $regex: req.query.cuisines, $options: 'i' };
}
    const total = await Restaurant.countDocuments(query);
    const restaurants = await Restaurant.find(query).skip(skip).limit(limit);

    res.json({
      restaurants,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
    const keyword = topLabels[0]?.split(",")[0]; 
    const labelRegex = new RegExp(keyword, "i");

    const results = await Restaurant.find({ cuisines: labelRegex }).limit(20);

    res.json({
      predicted: topLabels.slice(0, 3),
      keyword,
      restaurants: results,
    });
  } catch (err) {
    console.error(" Error in imageSearch:", err);
    res.status(500).json({ error: "Failed to process image search" });
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
