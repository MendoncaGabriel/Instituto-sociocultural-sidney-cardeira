const userModel = require('../models/userModel.js')
module.exports = {
    create: async (req, res) => {
        try {            
            const response = await userModel.create({
                user: req.body.user,
                password: req.body.pass
            })

            res.status(200).json(response)
        } catch (error) {
            console.error(error);
            res.status(500).json(error)
            
        }

    },
    update: async (req, res) => {
        try {            
            const response = await userModel.update(
                req.params.id,
                {
                    user: req.body.user,
                    password: req.body.pass
                }
            )
            res.status(200).json(response)
        } catch (error) {
            console.error(error);
            res.status(500).json(error)
            
        }

    },
    delete: async (req, res) => {
        try {            
           const response = await userModel.delete(req.params.id)
            res.status(200).json(response)
        } catch (error) {
            console.error(error);
            res.status(500).json(error)
        }
    },

}