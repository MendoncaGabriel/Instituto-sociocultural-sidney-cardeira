const personSchema = require('./schema/personSchema')
const serviceSchema = require('./schema/serviceSchema')
const path = require('path')
const fs = require('fs')

const validation = {
    cpf: (cpf) => {
        // Remover caracteres não numéricos do CPF
        cpf = cpf.replace(/\D/g, '');

        // Verificar se o CPF possui 11 dígitos
        if (cpf.length !== 11) {
            return false;
        }

        // Verificar se todos os dígitos são iguais
        if (/^(\d)\1{10}$/.test(cpf)) {
            return false;
        }

        // Calcular o primeiro dígito verificador
        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let digitoVerificador1 = 11 - (soma % 11);
        if (digitoVerificador1 > 9) {
            digitoVerificador1 = 0;
        }

        // Verificar o primeiro dígito verificador
        if (parseInt(cpf.charAt(9)) !== digitoVerificador1) {
            return false;
        }

        // Calcular o segundo dígito verificador
        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
        }
        let digitoVerificador2 = 11 - (soma % 11);
        if (digitoVerificador2 > 9) {
            digitoVerificador2 = 0;
        }

        // Verificar o segundo dígito verificador
        if (parseInt(cpf.charAt(10)) !== digitoVerificador2) {
            return false;
        }

        // CPF válido
        return true;
    }
};

exports.metadata = async () => {
    const data = {
        persons: 0, 
        woman: 0,
        man: 0,
        dependents: 0,
        dependentsWoman: 0,
        dependentsMan: 0,
        children: 0,
        elderly: 0
    }

    const person = await personSchema.find()

    data.persons =  person.filter(e => e.activeUser == true).length
    data.woman =  person.filter(e => e.sex == 'woman').length
    data.man =  person.filter(e => e.sex == 'man').length
    data.dependents =  person.filter(e => e.dependents).length
    const personWithDependents = person.map(e => e.dependents.length > 0 ? e.dependents : '');

    data.dependentsWoman = personWithDependents
    .flat() // Achatando a matriz para obter uma lista de todos os dependentes
    .filter(dependent => dependent !== '' && dependent.sex === 'woman' && dependent.active === true)
    .length;

    data.dependentsMan = personWithDependents
    .flat() // Achatando a matriz para obter uma lista de todos os dependentes
    .filter(dependent => dependent !== '' && dependent.sex === 'man' && dependent.active === true)
    .length;


     
    const today = new Date();
    const year = today.getFullYear();

    person.map(e => {
        if(e.activeUser == true){
            const dateString = e.dateOfBirth
            const dateParts = dateString.split('/');
            const yearP = dateParts[2];
    
            const idade = year - yearP
            if(idade <= 12){
                data.children += 1
            }
            if(idade >= 60){
                data.elderly += 1
            }

        }
    })
    



    

    return data;
}


exports.create = async (data) =>{
    try {
        // //VALIDAÇÕES
        // if(validation.name(data.name) == false){
        //     console.log('name')
        //     throw new Error('nome invalido');
        // }
        // if(validation.cpf(data.cpf) == false){
        //     console.log('cpf')
        //     throw new Error('cpf invalido');
        // }


        const newUser = new personSchema(data)
        const savedUser = await newUser.save()
        if(savedUser){
            console.log('Usuario criado com sucess!')
            return  savedUser
        }
    } catch (error) {
        throw new Error('Erro ao criar usuario', error.message);
    }
}

exports.update = async (id, data) => {
    try {        
        const updatedUser = await personSchema.findByIdAndUpdate(id, data, { new: true });
        if(updatedUser){
            return updatedUser
        }
    } catch (error) {

        throw new Error('Erro ao atualidar dados do usuario')
    }
}

exports.findById = async (id) => {
    try {        
        const oldUser = await personSchema.findById(id)
        if(oldUser){
            return oldUser
        }
    } catch (error) {
        throw new Error('Erro ao abuscar usuario por id')
    }
}

exports.findByIdDependents = async (id) => {
    try {
        const user = await personSchema.findOne({'dependents._id': id});

        if (!user) {
            throw new Error('Usuário não encontrado');
        }
        const dependent = user.dependents.find(dep => dep._id.toString() === id);

        if (dependent) {
            return dependent;
        } else {
            throw new Error('Dependente não encontrado');
        }
    } catch (error) {
        throw new Error('Erro ao buscar dependente por id: ' + error.message);
    }
}

exports.findByIdAndUpdateDependent = async (id, newData, img) => {
    try {
        const user = await personSchema.findOne({'dependents._id': id});
        if (!user) {
            throw new Error('Usuário não encontrado');
        }
        
        if(img.length > 0){
            newData.image = img
        }

        const dependent = user.dependents.find(dep => dep._id.toString() == id);
    
        //remover imagem existente
        if(img.length > 0 && dependent.image.length > 0){
            // Caminho absoluto do arquivo
            const caminhoAbsoluto = path.resolve(__dirname, '../', '../', 'src', 'public', 'images', dependent.image);

            // Verificar se o arquivo existe
            fs.access(caminhoAbsoluto, fs.constants.F_OK, (err) => {
                if (err) {
                    console.error(`>>> O arquivo  não existe.: ${dependent.image}`);
                    return;
                }

                // Remover o arquivo
                fs.unlink(caminhoAbsoluto, (err) => {
                    if (err) {
                        console.error(`Erro ao remover o arquivo ${dependent.image}: ${err}`);
                        return;
                    }
                    console.log(`Arquivo ${dependent.image} removido com sucesso.`);
                });
               
            });
        }

        // Atualiza os valores do dependente com os novos dados
        Object.assign(dependent, newData);
        // Salva o documento do usuário para persistir as alterações no dependente
        await user.save();


        if (dependent) {
            return {dependent, user};
        } else {
            throw new Error('Dependente não encontrado');
        }
    } catch (error) {
        throw new Error('Erro ao buscar dependente por id: ' + error.message);
    }
}

exports.addNewDependent = async (id, dependent) => {
    console.log(id)
    console.log(dependent)
    try {
       
        const updatedUser = await personSchema.findByIdAndUpdate(id, { $push: { dependents: dependent } }, { new: true });
        console.log('Dependente adicionado com sucesso:');
        return updatedUser;
    } catch (err) {
        console.error('Erro ao adicionar dependente:', err);
        throw err; // Rejeitar a promessa e propagar o erro para o chamador
    }
}

exports.activate = async (id) => {
    try {        
        const updatedUser = await personSchema.findByIdAndUpdate(id, { activeUser: true }, { new: true });
        if (updatedUser) {
            return updatedUser
        }

    } catch (error) {
        throw new Error('Erro ao ativar')
    }
}

exports.disactivate = async (id) => {
    try {        
        const updatedUser = await personSchema.findByIdAndUpdate(id, { activeUser: false }, { new: true });
        if (updatedUser) {
            return updatedUser
        }

    } catch (error) {
        throw new Error('Erro ao desativar')
    }
}

exports.disactivateDependent = async (id) => {
    try {        
        const user = await personSchema.findOne({'dependents._id': id});
        if (!user) {
            throw new Error('Dependent não encontrado');
        }
        const dependent = user.dependents.find(dep => dep._id.toString() == id);

        // Atualiza os valores do dependente com os novos dados
        Object.assign(dependent, { active: false });
        // Salva o documento do usuário para persistir as alterações no dependente
        await user.save();

   
        if (dependent) {
            return  user._id.toString()
        }

    } catch (error) {
        throw new Error('Erro ao desativar')
    }
}

exports.findByQuery = async (query) => {
    try {
        const users = await personSchema.find(query);
        return users
    } catch (error) {
        throw new Error('Erro ao buscar por query')
    }

}

exports.getList = async (page, limit, active) => {
    try {
        const skip = (page - 1) * limit;
        const users = await personSchema.find({activeUser: active || true}).skip(skip).limit(limit);
        
        return users;
        
    } catch (err) {
        throw new Error('Erro ao buscar usuários por lista');
    }
}

exports.findByDate = async (dateString) => {
    try{
        // Divida a string de data em dia, mês e ano
        const [day, month, year] = dateString.split('-');

        // Reconstrua a string de data no formato "ano-mes-dia"
        const formattedDate = `${year}-${month}-${day}`;

        // Converta a string de data para um objeto Date
        const date = new Date(formattedDate);
        // Configure a data para iniciar às 00:00:00 para incluir todos os registros do dia
        date.setHours(0, 0, 0, 0);

        // Realize a consulta no banco de dados para buscar usuários cadastrados na data especificada
        const users = await personSchema.find({ createdAt: { $gte: date } });
        return users
    }catch(error){
        throw new Error('Erro ao buscar usuarios por data')
    }
}

exports.assignServiceToPerson = async (idUser,idService) => {
    const service = await serviceSchema.findById(idService)
    service.createdAt = Date.now()

    const user = await personSchema.findByIdAndUpdate(idUser, { $push: { services: service } }, { new: true });
    return user
}
exports.removeAssignment = async (idUser, idService) => {
    try {
        // Remover o serviço do usuário
        const user = await personSchema.findByIdAndUpdate(idUser, { $pull: { services: { _id: idService } } }, { new: true });
        console.log(user)
        return user;
    } catch (error) {
        console.error('Erro ao remover atribuição de serviço:', error);
        throw error;
    }
}

