const fs = require('fs');
const path = require('path')
const userSchema = require('../database/schema/usuario.schema')

//CREATE
exports.create = async (req, res) => {
    try{
        const data = req.body

        let userObject = {
            name: data.name ?? '',
            sex: data.sex ?? '',
            whatsapp: data.whatsapp && data.whatsapp == 'on' ? true : false,
            email: data.email ?? '',
            activeUser: true,
            image: "",
            rg: data.rg ?? '',
            cpf: data.cpf.replace(/\./g, '').replace(/-/g, '') ?? '',
            tel: data.tel ?? '',
            dateOfBirth: data.dateOfBirth ?? '',
            address: {
              publicPlace: data.publicPlace ?? '',
              cep: data.cep ?? '',
              neighborhood: data.neighborhood ?? '',
              city: data.city ?? '',
              uf: data.uf ?? '',
              country: data.country ?? '',
              houseNumber: data.houseNumber ?? ''
            },
            dependents: [],
            createdAt: new Date()
        };

        //AGRUPANDO DEPENDENTES EM ARRAY DE OBJETOS
        if(data.name_dependent){

            for (let i = 0; i < data.name_dependent.length; i++) {
                userObject.dependents.push({
                    name: data.name_dependent[i],
                    rg: data.rg_dependent[i],
                    cpf: data.cpf_dependent[i],
                    dateOfBirth: data.dateOfBirth_dependent[i],
                    image: "-"
                });
            }
        }

        // SALVANDO IMAGENS
        if (req.files && req.files.length > 0) {

            // Atualize a imagem do usuário principal
            userObject.image = req.files[0].filename;
        
            // Atualize as imagens dos dependentes
            for (let i = 1; i < req.files.length; i++) {
                // Verifica se há um dependente para cada arquivo enviado
                if (userObject.dependents[i - 1]) {
                    userObject.dependents[i - 1].image = req.files[i].filename;
                } else {
                    console.error(`Não há dependente correspondente para o arquivo ${req.files[i].filename}`);
                }
            }
        }
        

        const newUser = new userSchema(userObject)
        const savedUser = await newUser.save()
        res.status(200).json(savedUser)
    }
    catch(err){
        if (err.code === 11000) {
            const duplicatedField = Object.keys(err.keyPattern)[0];
            console.log(err)
            console.log(duplicatedField)
            return res.status(400).json(`O campo '${duplicatedField}' já está em uso.`);
        }
        console.log(err)
        res.status(400).json(err)
    }
};


exports.updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;

        let userObject = {
            name: data.name ?? '',
            whatsapp: data.whatsapp && data.whatsapp == 'on' ? true : false,
            email: data.email ?? '',
            activeUser: true,
            rg: data.rg ?? '',
            cpf: data.cpf.replace(/\./g, '').replace(/-/g, '') ?? '',
            tel: data.tel ?? '',
            dateOfBirth: data.dateOfBirth ?? '',
            address: {
              publicPlace: data.publicPlace ?? '',
              cep: data.cep ?? '',
              neighborhood: data.neighborhood ?? '',
              city: data.city ?? '',
              uf: data.uf ?? '',
              country: data.country ?? '',
              houseNumber: data.houseNumber ?? ''
            },
            createdAt: new Date()
        }

        data.sex ? userObject.sex = data.sex  : ''


        if(req.files[0].filename){
            userObject.image = req.files[0].filename

            const oldUser = await userSchema.findById(id)
            if(oldUser.image ){
                const imagePath = path.join(__dirname, '../', 'public', 'images', oldUser.image);

                // Verifica se o arquivo existe
                fs.access(imagePath, fs.constants.F_OK, (err) => {
                    if (!err) {
                        // O arquivo existe, então apaga ele
                        fs.unlink(imagePath, (err) => {
                            if (err) {
                                console.error('Erro ao apagar a imagem:', err);
                                return;
                            }
                            console.log('Imagem apagada com sucesso!');
                        });
                    } else {
                        console.error('A imagem não existe ou não pode ser acessada:', err);
                    }
                });
            }

            
        }


        // Atualiza os dados do usuário
        const updatedUser = await userSchema.findByIdAndUpdate(id, userObject, { new: true });

        // Verifica se o usuário foi encontrado e atualizado com sucesso
        if (!updatedUser) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        res.status(200).json(updatedUser);
    } catch (err) {
        // Trata erros durante a atualização do usuário
        console.error('Erro ao atualizar dados do usuário:', err);
        res.status(400).json({ message: "Ocorreu um erro ao atualizar dados do usuário", error: err });
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

exports.disactivateUser = async (req, res) => {
    try {
        const id = req.params.id;

        // Atualizar o usuário no banco de dados
        const updatedUser = await userSchema.findByIdAndUpdate(id, { activeUser: false }, { new: true });

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


//GET
exports.searchUserById = async (id) => {
    try{
        const user = await userSchema.findById(id)
        return user
    }
    catch(err){
        throw err;
    }
};

exports.getFilter = async (req, res) => {
    try {
        let query = {};

        if (req.query.name) {
            const regex = new RegExp(req.query.name, 'i');
            query.name = { $regex: regex };
        }

        if (req.query.tel) {
            query.tel = req.query.tel;
        }

        if (req.query.cpf) {
            const regexCPF = new RegExp(req.query.cpf, 'i');
            query.cpf = { $regex: regexCPF };
        }

        const users = await userSchema.find(query);

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};






exports.getListOfUsers = async (page, limit, active) => {
    try {
        const skip = (page - 1) * limit;
        const users = await userSchema.find({activeUser: active || true}).skip(skip).limit(limit);
        
        return {
            currentPage: page,
            totalPages: Math.ceil(await userSchema.countDocuments() / limit),
            users
        };
    } catch (err) {
        throw err;
    }
};

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


