const mongoose = require('mongoose');
const Restaurant = require('../models/Restaurant');

mongoose.connect('mongodb://localhost:27017/zomato');

const updateAllLocations = async () => {
  try {
    const restaurants = await Restaurant.find({
    'location.coordinates': [0, 0],
    longitude: { $ne: null },
    latitude: { $ne: null },
    });


    console.log(`🔎 Found ${restaurants.length} restaurants to update`);

    for (let r of restaurants) {
      r.location = {
        type: 'Point',
        coordinates: [r.longitude, r.latitude],
      };
      await r.save();
      console.log(`✅ Updated location for: ${r.name}`);
    }

    console.log('🎉 Migration complete');
  } catch (err) {
    console.error('❌ Migration failed:', err);
  } finally {
    mongoose.disconnect();
  }
};

updateAllLocations();
