const userController = require('../controllers/user.controller')

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
        
        const listUsers = await userController.getListOfUsers(page, limit);
        
        res.render('listOfPeoples', { page: 'listOfPeoples', users: listUsers.users });
    } catch (err) {
        res.status(400).json(err);
    }
};

exports.personProfile = async (req, res) => {
    const id = req.query.id;
   
    const userData = await userController.searchUserById(id);
    console.log(userData)
    res.render('personProfile', {page: 'personProfile', userData})
}

exports.editRegistration = async (req, res) => {
    const id = req.query.id;
   
    const userData = await userController.searchUserById(id);
    console.log(userData)
    res.render('editRegistration', {page: 'editRegistration', userData})
}