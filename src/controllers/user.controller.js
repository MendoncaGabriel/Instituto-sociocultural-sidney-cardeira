const fs = require('fs');
const path = require('path')
const userSchema = require('../database/schema/usuario.schema')

exports.create = async (req, res) => {

    try{
        const {name, address, rg, tel, dateOfBirth, dependents} = req.body
        const user = {name, address, rg, tel, dateOfBirth, dependents}

        // Verifica se há um arquivo de imagem na requisição
        if (req.file) {
            user.image = req.file.filename; 
        }

        
        const newUser = new userSchema(user)
        const savedUser = await newUser.save()
    
    
        res.status(200).json(savedUser)
    }
    catch(err){
        if (err.code === 11000 && err.keyPattern.name) {
            return res.status(400).json(`Usuário com o nome '${req.body.name}' já cadastrado!`)
        }
        res.status(400).json(err)
    }
}

exports.addNewDependent = async (req, res) => {
    const id = req.params.id;
    const { name, rg, cpf, dateOfBirth } = req.body;

    try {
        const user = await userSchema.findById(id);
        if (!user) {
            return res.status(404).json({ msg: 'Usuário não encontrado' });
        }

        // Cria um novo dependente
        const newDependent = {
            name,
            rg,
            cpf,
            dateOfBirth
        };

        if (req.file) {
            newDependent.image = req.file.filename; 
        }

        // Adiciona o dependente ao array de dependentes do usuário
        user.dependents.push(newDependent);

        // Salva as alterações no usuário
        await user.save();

        return res.status(200).json({ msg: `Dependente adicionado com sucesso ao usuário ${user.name}`, newDependent });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

exports.updateDependentData = async (req, res) => {
    const dependentId = req.params.id;
    const newData = req.body;

    if (req.file) {
        newData.image = req.file.filename;
    }

    try {
        // Encontre o usuário que possui o dependente com o ID fornecido
        const user = await userSchema.findOne({ "dependents._id": dependentId });
        if (!user) {
            return res.status(404).json({ msg: 'Usuário não encontrado' });
        }

        // Encontre o dependente dentro do array de dependentes do usuário
        const dependent = user.dependents.id(dependentId);
        if (!dependent) {
            return res.status(404).json({ msg: 'Dependente não encontrado' });
        }

        // se houver uma imagem antiga e uma nova imagem, apague a antiga
        if (dependent.image && req.file) {
            // Apagar imagem anterior de forma síncrona
            try {
                const filePath = path.join(__dirname, '..', 'public', 'images', dependent.image);
                fs.unlinkSync(filePath);
                console.log('Imagem antiga apagada:', dependent.image);
            } catch (err) {
                console.error('Erro ao apagar a imagem antiga:', err);
            }
        }

        // Atualize os dados do dependente com os novos dados
        Object.assign(dependent, newData);

        // Salve as alterações no usuário
        await user.save();

        return res.status(200).json({ msg: 'Dados do dependente atualizados com sucesso', dependent });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

exports.searchUserById = async (req, res) => {
    try{
        const id = req.params.id
        const user = await userSchema.findById(id)
        res.status(200).json(user)
    }
    catch(err){
        res.status(400).json(err)
    }
}

exports.searchUserByName = async (req, res) => {
    try{
        const name = req.params.name
        const user = await userSchema.findOne({name: name})
        res.status(200).json(user)
    }
    catch(err){
        res.status(400).json(err)
    }
}

exports.searchUserByTel = async (req, res) => {
    try{
        const tel = req.params.tel
        const user = await userSchema.findOne({tel: tel})
        res.status(200).json(user)
    }
    catch(err){
        res.status(400).json(err)
    }
}

exports.searchUsersByDate = async (req, res) => {
    try {
        const dateString = req.params.date; // Recebe a string de data do parâmetro (dia-mes-ano "15-03-2024")

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

        res.status(200).json(users);
    } catch (err) {
        res.status(400).json({ message: "Ocorreu um erro ao buscar usuários cadastrados na data especificada", error: err });
    }
};

exports.searchUsersByActive = async (req, res) => {
    try {
        const active = req.params.active; 

       
        const users = await userSchema.find({ activeUser: active });

        res.status(200).json(users);
    } catch (err) {
        res.status(400).json({ message: "Ocorreu um erro ao buscar usuários Ativos / Inativos", error: err });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;

        // Verifica se um arquivo foi enviado
        if (req.file) {
            data.image = req.file.filename; 
            console.log('Nova imagem:', req.file.filename )

            // Verificar se atualizou a foto
            const dataUser = await userSchema.findById(id)
            if (dataUser.image && dataUser.image !== req.file.filename) {
                // Apagar imagem anterior
                const filePath = path.join(__dirname, '..', 'public', 'images', dataUser.image);

                // Verifica se o arquivo existe antes de tentar apagá-lo
                fs.access(filePath, fs.constants.F_OK, (err) => {
                    if (err) {
                        console.error('O arquivo não existe:', err);
                        return;
                    }

                    // Se o arquivo existe, tenta apagá-lo
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.error('Erro ao apagar o arquivo:', err);
                            return;
                        }
                        console.log('Arquivo apagado com sucesso!');
                    });
                });
                console.log('Imagem antiga apagada:', dataUser.image)
            }
        }

        // Adicione a opção { new: true } para retornar o usuário atualizado
        const updatedUser = await userSchema.findByIdAndUpdate(id, data, { new: true });

        // Verifique se o usuário foi encontrado e atualizado com sucesso
        if (!updatedUser) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: "Ocorreu um erro ao atualizar dados do usuário", error: err });
    }
};

exports.disactivateUser = async (req, res) => {
    try {
        const id = req.params.id;

        // Atualizar o usuário no banco de dados
        const updatedUser = await userSchema.findByIdAndUpdate(id, { activeUser: false }, { new: true });

        // Verificar se o usuário foi encontrado e atualizado com sucesso
        if (!updatedUser) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        res.status(200).json({msg:"Usuario desativado", updatedUser});
    } catch (err) {
        console.error("Erro ao desativar usuário:", err);
        res.status(500).json({ message: "Ocorreu um erro ao desativar usuário" });
    }
};

exports.activateUser = async (req, res) => {
    try {
        const id = req.params.id;

        // Atualizar o usuário no banco de dados
        const updatedUser = await userSchema.findByIdAndUpdate(id, { activeUser: true }, { new: true });

        // Verificar se o usuário foi encontrado e atualizado com sucesso
        if (!updatedUser) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        res.status(200).json({msg:"Usuario ativo", updatedUser});
    } catch (err) {
        console.error("Erro ao desativar usuário:", err);
        res.status(500).json({ message: "Ocorreu um erro ao ativar usuário" });
    }
};
