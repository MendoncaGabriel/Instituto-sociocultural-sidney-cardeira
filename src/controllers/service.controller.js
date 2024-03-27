
const servicesModel = require('../models/serviceModel')
module.exports = {
    create: async (req, res) => {
        const doc = await servicesModel.create(req.body)
        res.status(200).json(doc)
    },
    delete: async (req, res) => {
        const doc = await servicesModel.delete(req.params.id)
        res.status(200).json(doc)
    },
    update: async (req, res) => {
        console.log('itens a atualizar:', req.params.id, req.body.name)
        const doc = await servicesModel.update(req.params.id, req.body.name)
        res.status(200).json(doc)
    }

}