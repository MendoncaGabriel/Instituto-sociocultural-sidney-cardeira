const userController = require('../controllers/user.controller')
const userSchema = require('../database/schema/usuario.schema')

exports.index = (req, res) => {
    res.render('home', {page: 'home'})
}

exports.registrationOfPeople = (req, res) => {
    res.render('registrationOfPeople', {page: 'registrationOfPeople'})
}

exports.listOfPeoples = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Página solicitada, padrão é 1
        const limit = parseInt(req.query.limit) || 20; // Quantidade de usuários por página
        
        const listUsers = await userController.getList(page, limit, true);
        
        res.render('listOfPeoples', { page: 'listOfPeoples', users: listUsers.users });
    } catch (err) {
        res.status(400).json(err);
    }
}

exports.personProfile = async (req, res) => {
    const id = req.query.id;
    const userData = await userController.findById(id);
    res.render('personProfile', {page: 'personProfile', userData})
}

exports.editRegistration = async (req, res) => {
    const id = req.query.id;
   
    const userData = await userController.findById(id);
    console.log(userData)
    res.render('editRegistration', {page: 'editRegistration', userData})
}

exports.editDependent = async (req, res) => {
    const id = req.query.id;
   
    const userData = await userSchema.findOne({'dependents._id': id});
    const dependent = userData.dependents.find(dep => dep._id.toString() === id);

    console.log(userData)
    if(userData){
        return res.render('dependent', {page: 'dependent', dependent})
    }else{
        return res.status(400).send('Erro')
    }
}