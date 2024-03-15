const mongoose = require('mongoose');

const dependentSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  image: {
    type: String
  },
  rg: {
    type: String,
    unique: true
  },
  cpf: {
    type: String,
    unique: true
  },
  dateOfBirth: {
    type: String,
  },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  activeUser: {
    type: Boolean,
    default: true
  },
  image: {
    type: String
  },
  address: {
    type: String,
  },
  rg: {
    type: String,
    unique: true
  },
  cpf: {
    type: String,
    unique: true
  },
  tel: {
    type: String,
    unique: true
  },
  dateOfBirth: {
    type: String,
  },
  dependents: [dependentSchema],
  createdAt: {
    type: Date,
    default: Date.now 
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
