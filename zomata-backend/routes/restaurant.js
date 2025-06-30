const express = require("express");
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: "uploads/" });
const Restaurant = require('../models/Restaurant');
const {
  getRestaurantById,
  getRestaurants,
  imageSearch,
  getNearbyRestaurants ,
  searchRestaurants,
} = require("../controllers/restaurantController");
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    const skip = (page - 1) * limit;

    const restaurants = await Restaurant.find().skip(skip).limit(limit);
    const total = await Restaurant.countDocuments();

    res.json({
      restaurants,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error(' Error fetching restaurants:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});
router.get("/", getRestaurants);
router.get('/nearby', getNearbyRestaurants);
router.get("/search/text", searchRestaurants);
router.get("/:id", getRestaurantById);
router.post("/search/image", upload.single("image"), imageSearch);

module.exports = router;
