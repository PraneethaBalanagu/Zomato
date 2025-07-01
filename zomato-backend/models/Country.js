const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
  country_id: Number,
  country_name: String
});

module.exports = mongoose.model('Country', countrySchema);
