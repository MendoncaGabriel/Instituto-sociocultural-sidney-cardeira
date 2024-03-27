const authModel = require('../models/authModel')
module.exports = {

    login: async (req, res) => {
        const result = await authModel.checkAdmin(req.body)
        if(result){

            return   res.status(200).json(result)
        }else{
            res.status(422).json({msg: 'Usuario ou senha invalidos!'})
        }
    }
}