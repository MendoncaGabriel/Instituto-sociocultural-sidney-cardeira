const mongoose = require('mongoose');

const servicesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  observation: {
    type: String,
  },
  
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const Service = mongoose.model('Service', servicesSchema);

module.exports = Service;