const userModel = require('../models/userModel')


exports.index = async (req, res) => {
    const data = await userModel.metadata()
    res.render('home', {page: 'home', data: data})
}

exports.registrationOfPeople = (req, res) => {
    res.render('registrationOfPeople', {page: 'registrationOfPeople'})
}

exports.listOfPeoples = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 20; 
        
        const listUsers = await userModel.getList(page, limit, true);

        
        res.render('listOfPeoples', { page: 'listOfPeoples', users: listUsers });
    } catch (err) {
        res.status(500).json({msg: 'Erro ao renderizar pagina listOfPeoples'});
    }
}

exports.personProfile = async (req, res) => {
    const id = req.query.id;
    const userData = await userModel.findById(id);
    res.render('personProfile', {page: 'personProfile', userData})
}

exports.editRegistration = async (req, res) => {
    const id = req.query.id;
   
    const userData = await userModel.findById(id);
    res.render('editRegistration', {page: 'editRegistration', userData})
}

exports.editDependent = async (req, res) => {
    try {
        const id = req.query.id;
        const dependent = await userModel.findByIdDependents(id);
        return res.render('editDependent', {page: 'editDependent', dependent})
        
    } catch (error) {
        console.log(error)
        res.status(500).json('Erro interno no servidor!')
    }
   
}