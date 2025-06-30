const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const restaurantRoutes = require("./routes/restaurant");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/restaurants", restaurantRoutes);
app.get("/",(req,res)=>{
    res.send("Zomato is running");
});
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("📦 MongoDB connected");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
}
app.put('/restaurant/:id', async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ error: 'Not found' });

    Object.assign(restaurant, req.body);

    if (latitude && longitude) {
      restaurant.location = {
        type: 'Point',
        coordinates: [longitude, latitude],
      };
    }

    await restaurant.save();
    res.json(restaurant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update restaurant' });
  }
});

startServer();