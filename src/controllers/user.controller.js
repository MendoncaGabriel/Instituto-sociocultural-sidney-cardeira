const userSchema = require('../database/schema/usuario.schema')

exports.create = async (req, res) => {

    try{
        const {name, address, rg, tel, dateOfBirth, dependents} = req.body
        const user = {name, address, rg, tel, dateOfBirth, dependents}

        req.file ? user.image = req.file.fileName : ''

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

//READ
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


// {
//     "name": "João Silva",
//     "address": "Rua Principal, 123",
//     "rg": "123456789",
//     "cpf": "987654321",
//     "tel": "1234567890",
//     "dateOfBirth": "1990-01-01",
//     "dependents": [
//       {
//         "name": "Maria Silva",
//         "image": "https://example.com/dependent1.jpg",
//         "rg": "987654321",
//         "cpf": "123456789",
//         "dateOfBirth": "2010-05-15"
//       },
//       {
//         "name": "Pedro Silva",
//         "image": "https://example.com/dependent2.jpg",
//         "rg": "123456789",
//         "cpf": "987654321",
//         "dateOfBirth": "2015-08-20"
//       }
//     ]
//   }