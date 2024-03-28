const mongoose = require('mongoose');

const servicestSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
  
})

const dependentSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true
  },
  sex:{
    type: String
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
})

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

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  whatsapp:{
    type: Boolean,
    default: false
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
  sex:{
    type: String
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
  services: [servicestSchema],
  address: address,
  dependents: [dependentSchema],
  createdAt: {
    type: Date,
    default: Date.now()
  }
})

const Person = mongoose.model('Person', personSchema);

module.exports = Person;
