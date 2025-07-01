const csv = require('csvtojson');
const mongoose = require('mongoose');
const Country = require('../models/Country');

mongoose.connect('mongodb://localhost:27017/zomato', { useNewUrlParser: true });

async function loadCountryCodes() {
  const countries = await csv().fromFile('../data/Country-Code.csv');
  await Country.insertMany(countries);
  console.log('Country codes loaded!');
  mongoose.disconnect();
}

loadCountryCodes();
