const personModel = require('../models/personModel')
const serviceModel = require('../models/schema/serviceSchema')
const serviceSchema = require('../models/schema/serviceSchema')
const userSchema = require('../models/schema/userSchema')
const jwt = require('jsonwebtoken')

module.exports = {
    services: async (req, res) => {
        const nameUser = req.nameUser 
    
        const data = await serviceSchema.find();
        res.render('services', {page: 'servicos', data, typeUser:res.locals.typeUser, nameUser})
    },
    index: async (req, res) => {
        const nameUser = req.nameUser 

        const data = await personModel.metadata()
        res.render('home', {page: 'home', data: data, typeUser: res.locals.typeUser, nameUser })
    },
    registrationOfPeople: (req, res) => {
        const nameUser = req.nameUser 
        res.render('registrationOfPeople', {page: 'registrationOfPeople', typeUser:res.locals.typeUser, nameUser})
    },
    listOfPeoples: async (req, res) => {
        const nameUser = req.nameUser 
    
        try {
            const page = parseInt(req.query.page) || 1; 
            const limit = parseInt(req.query.limit) || 20; 
            
            const listUsers = await personModel.getList(page, limit, true);
    
            
            res.render('listOfPeoples', { page: 'listOfPeoples', users: listUsers, typeUser:res.locals.typeUser , nameUser});
        } catch (err) {
            res.status(500).json({msg: 'Erro ao renderizar pagina listOfPeoples'});
        }
    },
    personProfile: async (req, res) => {
        const nameUser = req.nameUser 
        const id = req.query.id;
        const userData = await personModel.findById(id);
        const services = await serviceModel.find();
        res.render('personProfile', {page: 'personProfile', userData, services, typeUser:res.locals.typeUser, nameUser})
    },
    editRegistration: async (req, res) => {
        const id = req.query.id;
        const nameUser = req.nameUser 
       
        const userData = await personModel.findById(id);
        res.render('editRegistration', {page: 'editRegistration', userData, typeUser:res.locals.typeUser, nameUser})
    },
    editDependent: async (req, res) => {
        try {
            const nameUser = req.nameUser 
            const id = req.query.id;
            const dependent = await personModel.findByIdDependents(id);
            return res.render('editDependent', {page: 'editDependent', dependent, typeUser:res.locals.typeUser, nameUser})
            
        } catch (error) {
            console.log(error)
            res.status(500).json('Erro interno no servidor!')
        }
       
    },
    users: async (req, res) => {
        const token  = req.cookies.token
        const nameUser = req.nameUser 

        
        
        // Verifica se o token é válido admin
        const decoded = jwt.verify(token, process.env.SECRET);
        if(decoded.type != 'admin' && decoded.user != 'admin'){
            return res.send('ACESSO NEGADO!')
        }
   

        const users = await userSchema.find()
        res.render('registerAccess', {page: 'registerAccess', users, typeUser:res.locals.typeUser, nameUser})

    }
}