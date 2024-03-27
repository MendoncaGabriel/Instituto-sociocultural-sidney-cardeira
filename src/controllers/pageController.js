const userModel = require('../models/userModel')
const serviceSchema = require('../models/schema/serviceSchema')
const serviceModel = require('../models/schema/serviceSchema')


module.exports = {
    services: async (req, res) => {
    
        const data = await serviceSchema.find();
        res.render('services', {page: 'servicos', data})
    },
    index: async (req, res) => {
        
        const data = await userModel.metadata()
        res.render('home', {page: 'home', data: data})
    },
    registrationOfPeople: (req, res) => {
        res.render('registrationOfPeople', {page: 'registrationOfPeople'})
    },
    listOfPeoples: async (req, res) => {
    
        try {
            const page = parseInt(req.query.page) || 1; 
            const limit = parseInt(req.query.limit) || 20; 
            
            const listUsers = await userModel.getList(page, limit, true);
    
            
            res.render('listOfPeoples', { page: 'listOfPeoples', users: listUsers });
        } catch (err) {
            res.status(500).json({msg: 'Erro ao renderizar pagina listOfPeoples'});
        }
    },
    personProfile: async (req, res) => {
        const id = req.query.id;
        const userData = await userModel.findById(id);
        const services = await serviceModel.find();
        res.render('personProfile', {page: 'personProfile', userData, services})
    },
    editRegistration: async (req, res) => {
        const id = req.query.id;
       
        const userData = await userModel.findById(id);
        res.render('editRegistration', {page: 'editRegistration', userData})
    },
    editDependent: async (req, res) => {
        try {
            const id = req.query.id;
            const dependent = await userModel.findByIdDependents(id);
            return res.render('editDependent', {page: 'editDependent', dependent})
            
        } catch (error) {
            console.log(error)
            res.status(500).json('Erro interno no servidor!')
        }
       
    },
}