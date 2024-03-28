const userSchema = require('../models/schema/userSchema')
module.exports = {
    create: async (data) => {
        try {
            const user = new userSchema(data);
            const doc = await user.save();
            console.log('Usuario salvo:', doc);
            return { msg: 'Usuário Salvo com sucesso!', doc };
        } catch (error) {
            console.error(error);
            return { msg: 'Erro ao Salvar usuário' };
        }
    },
    update: async (id, data) => {
        try {
            console.log(id, data)
            
            const doc = await userSchema.findByIdAndUpdate(id, data)
            console.log('Usuário atualizado com sucesso!:', doc);
            return { msg: 'Usurio atualizado com sucesso!:', doc };
        } catch (error) {
            console.error(error);
            return { msg: 'Erro ao Atualizar usuário' };
        }
    },
    delete: async (id) => {
        try {
           
            const doc = await userSchema.findByIdAndDelete(id)
            console.log('Usuário removido com sucesso!:', doc);
            return { msg: 'Usurio removido com sucesso!:', doc };
        } catch (error) {
            console.error(error);
            return { msg: 'Erro ao removido usuário' };
        }
    },

};
