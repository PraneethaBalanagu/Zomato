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
router.get("/", getRestaurants);
router.get('/nearby', getNearbyRestaurants);
router.get("/search/text", searchRestaurants);
router.get("/:id", getRestaurantById);
router.post("/search/image", upload.single("image"), imageSearch);

module.exports = router;
