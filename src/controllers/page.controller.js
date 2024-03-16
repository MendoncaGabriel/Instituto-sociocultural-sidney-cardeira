exports.index = (req, res) => {
    res.render('home', {page: 'home'})
}
exports.registrationOfPeople = (req, res) => {
    res.render('registrationOfPeople', {page: 'registrationOfPeople'})
}