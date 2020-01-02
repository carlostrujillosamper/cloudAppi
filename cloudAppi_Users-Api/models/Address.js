const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const addressSchema = new Schema({
 
  street: String,
  state: String,
  city: String,
  country: String,
  zip: String

});

const Address = mongoose.model('Address', addressSchema);
module.exports = Address;