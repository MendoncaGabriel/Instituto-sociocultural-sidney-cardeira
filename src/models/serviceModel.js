const servicesModel = require('./schema/serviceSchema')

module.exports = {
    create: async  (data) => {
        const newService = new servicesModel(data)
        const doc = await newService.save()
    
      
        return {msg:'Serviço criado com sucesso!', doc}
    },
    delete: async  (id) => {
        const doc = await servicesModel.findByIdAndDelete(id)

        return {msg:'Serviço deletado com sucesso!', doc}
    },
    update: async  (id, newName) => {
        const doc = await servicesModel.findByIdAndUpdate(id, { name: newName }, { new: true });


        return {msg:'Serviço atualizado com sucesso!', doc}
    },

}