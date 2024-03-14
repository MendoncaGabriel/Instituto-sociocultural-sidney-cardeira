exports.loginPage = (req, res) => {
    res.render('admin/login')
}


exports.login = (req, res) => {
    const {user, password} = req.body

    res.status(200).json({ msg: 'ok' });
}