const mongoose = require('mongoose');

const dependents = new mongoose.Schema({
  name: {
    type: String,
  },
  image:{
    type: String
  },
  rg: {
    type: String,
  },
  cpf: {
    type: String,
  },
  dateOfBirth: {
    type: String,
  },
})

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique: true
  },
  activeUser:{
    type: Boolean,
    default: true
  },
  image:{
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
  dependents: [dependents],
  createdAt: {
    type: Date,
    default: Date.now 
  }
});

const user = mongoose.model('user', userSchema);

module.exports = user;
