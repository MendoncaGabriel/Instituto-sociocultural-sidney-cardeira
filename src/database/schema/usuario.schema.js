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
  },
  cpf: {
    type: String,
  },
  dateOfBirth: {
    type: String,
  },
});

const address = new mongoose.Schema({
  publicPlace:{
    type: String
  }, 
  cep:{
    type: String
  },
  neighborhood:{
    type: String
  },
  city:{
    type: String
  },
  uf:{
    type: String
  },
  country:{
    type: String
  },
  houseNumber:{
    type: String
  }

})

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  activeUser: {
    type: Boolean,
    default: true
  },
  image: {
    type: String
  },
  rg: {
    type: String,
  },
  cpf: {
    type: String,
  },
  tel: {
    type: String,
  },
  dateOfBirth: {
    type: String,
  },
  address: address,
  dependents: [dependentSchema],
  createdAt: {
    type: Date,
    default: Date.now 
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
