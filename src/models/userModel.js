const userSchema = require('../models/schema/usuario.schema')

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


        const newUser = new userSchema(data)
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
        const updatedUser = await userSchema.findByIdAndUpdate(id, data, { new: true });
        if(updatedUser){
            return updatedUser
        }
    } catch (error) {

        throw new Error('Erro ao atualidar dados do usuario')
    }
}

exports.findById = async (id) => {
    try {        
        const oldUser = await userSchema.findById(id)
        if(oldUser){
            return oldUser
        }
    } catch (error) {
        throw new Error('Erro ao abuscar usuario por id')
    }
}
exports.findByIdDependents = async (id) => {
    try {
        const user = await userSchema.findOne({'dependents._id': id});
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


exports.activate = async (id) => {
    try {        
        const updatedUser = await userSchema.findByIdAndUpdate(id, { activeUser: true }, { new: true });
        if (updatedUser) {
            return updatedUser
        }

    } catch (error) {
        throw new Error('Erro ao ativar')
    }
}

exports.disactivate = async (id) => {
    try {        
        const updatedUser = await userSchema.findByIdAndUpdate(id, { activeUser: false }, { new: true });
        if (updatedUser) {
            return updatedUser
        }

    } catch (error) {
        throw new Error('Erro ao desativar')
    }
}

exports.findByQuery = async (query) => {
    try {
        const users = await userSchema.find(query);
        return users
    } catch (error) {
        throw new Error('Erro ao buscar por query')
    }

}
exports.getList = async (page, limit, active) => {
    try {
        const skip = (page - 1) * limit;
        const users = await userSchema.find({activeUser: active || true}).skip(skip).limit(limit);
        
        return users;
        
    } catch (err) {
        throw new Error('Erro ao buscar usuários por lista');
    }
};


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
        const users = await userSchema.find({ createdAt: { $gte: date } });
        return users
    }catch(error){
        throw new Error('Erro ao buscar usuarios por data')
    }
}
