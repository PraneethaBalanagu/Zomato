const csv = require('csvtojson');
const mongoose = require('mongoose');
const Restaurant = require('../models/Restaurant');

mongoose.connect('mongodb://localhost:27017/zomato');

async function loadZomatoData() {
  try {
    const rawData = await csv().fromFile('../data/zomato.csv');

    const formattedRestaurants = rawData
  .filter(item =>
    item['Longitude'] && item['Latitude'] &&
    !isNaN(parseFloat(item['Longitude'])) &&
    !isNaN(parseFloat(item['Latitude']))
  )
  .map((item) => ({
    restaurantId: Number(item['Restaurant ID']),
    name: item['Restaurant Name'],
    countryCode: Number(item['Country Code']),
    city: item['City'],
    address: item['Address'],
    locality: item['Locality'],
    longitude: parseFloat(item['Longitude']),
    latitude: parseFloat(item['Latitude']),
    cuisines: item['Cuisines'],
    averageCostForTwo: Number(item['Average Cost for two']),
    currency: item['Currency'],
    hasTableBooking: item['Has Table booking'],
    hasOnlineDelivery: item['Has Online delivery'],
    isDeliveringNow: item['Is delivering now'],
    switchToOrderMenu: item['Switch to order menu'],
    priceRange: Number(item['Price range']),
    aggregateRating: Number(item['Aggregate rating']),
    ratingColor: item['Rating color'],
    ratingText: item['Rating text'],
    votes: Number(item['Votes']),
    location: {
      type: 'Point',
      coordinates: [
        parseFloat(item['Longitude']),
        parseFloat(item['Latitude']),
      ],
    },
  }));
    await Restaurant.deleteMany(); 
    await Restaurant.insertMany(formattedRestaurants);
  
    console.log('Zomato data loaded with location field!');
  } catch (err) {
    console.error(' Error loading data:', err);
  } finally {
    mongoose.disconnect();
  }
}

loadZomatoData();
