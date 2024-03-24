const fs = require('fs');
const path = require('path')
// const userSchema = require('../models/schema/usuario.schema')
const userModel = require('../models/userModel')

//CREATE
exports.create = async (req, res) => {
    try{
        const data = req.body

        //FORMATAR OBJETO DATAFORM
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
        }

        //AGRUPANDO DEPENDENTES EM ARRAY DE OBJETOS
        if(data.name_dependent){
            
            if (typeof data.name_dependent !== 'object' || !Array.isArray(data.name_dependent)) {
            
                userObject.dependents.push({
                    name: data.name_dependent,
                    rg: data.rg_dependent,
                    cpf: data.cpf_dependent,
                    dateOfBirth: data.dateOfBirth_dependent,
                    image: ""
                });
                
            }else{
                for (let i = 0; i < data.name_dependent.length; i++) {
                    userObject.dependents.push({
                        name: data.name_dependent[i],
                        rg: data.rg_dependent[i],
                        cpf: data.cpf_dependent[i],
                        dateOfBirth: data.dateOfBirth_dependent[i],
                        image: ""
                    });
                }
            }
        }


        // SALVANDO IMAGENS
        if (req.files && req.files.length > 0) {

            // Atualize a imagem do usuário 
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
        
        const savedUser = await userModel.create(userObject)
        res.status(200).json(savedUser)
    }
    catch(error){
        console.error('Erro:', error.message);
        if (error.code === 11000) {
            const duplicatedField = Object.keys(error.keyPattern)[0];
            return res.status(400).json(`O campo '${duplicatedField}' já está em uso.`);
        }
        
        res.status(400).json(error)
    }
};

exports.update = async (req, res) => {
    try {
        const id = req.query.id;
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


        if(req.files && req.files[0] && req.files[0].filename){
            userObject.image = req.files[0].filename

            const oldUser = await userModel.findById(id)

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

        const updatedUser = await userModel.update(id, userObject)
        if (!updatedUser) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Erro:', error.message);

        res.status(400).json({ message: "Ocorreu um erro ao atualizar dados do usuário"});
    }
};

exports.dependentUpdate = async (req, res) => {
    try {
        const id = req.query.id;
        console.log('>>> id:', id)
        
        const data = req.body;
        console.log('>>> data:', data)

        const img = req.files && req.files.length > 0 && req.files[0].filename ? req.files[0].filename : '';
        console.log('>>> img:', img)


        // Atualiza o dependente no banco de dados
        const response = await userModel.findByIdAndUpdateDependent(id, data, img);
        const dependenteAtualizado = response.dependent
        console.log('>>> dependenteAtualizado:', dependenteAtualizado, response.user._id)
        res.status(200).json({msg: 'Dependente atualizado!', dependenteAtualizado, userId: response.user._id})


    } catch (error) {
        console.error('Erro:', error.message);

        res.status(400).json({ message: "Ocorreu um erro ao atualizar dados do usuário"});
    }
};

exports.activate = async (req, res) => {
    try {
        const id = req.query.id
        const updatedUser = await userModel.activate(id)

        res.status(200).json({msg:"Usuario ativo", updatedUser});
    } catch (error) {
        console.error('Erro:', error.message);
        res.status(500).json({ message: "Ocorreu um erro ao ativar usuário" });
    }
};

exports.disactivate = async (req, res) => {
    try {
        const id = req.query.id;
        const updatedUser = await userModel.disactivate(id)

        res.status(200).json({msg:"Usuario desativado", updatedUser});
    } catch (error) {
        console.error('Erro:', error.message);
        res.status(500).json({ message: "Ocorreu um erro ao ativar usuário" });
    }
};
exports.disactivateDependent = async (req, res) => {
    try {
        const id = req.query.id;
        const updatedUser = await userModel.disactivateDependent(id)

        res.status(200).json({msg:"Dependent desativado", updatedUser});
    } catch (error) {
        console.error('Erro:', error.message);
        res.status(500).json({ message: "Ocorreu um erro ao ativar dependent" });
    }
};

exports.findById = async (id) => {
    try{
        const user = await userSchema.findById(id)
        return user
    }
    catch(error){
        console.error('Erro:', error.message);
        res.status(500).json({msg:"Erro ao desativar usuario"});
    }
};

exports.findByQuery = async (req, res) => {
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

        const users = await userModel.findByQuery(query)

        res.status(200).json(users);
    } catch (error) {
        console.error('Erro:', error.message);
        res.status(500).json({ message: error.message });
    }
};

exports.getList = async (page, limit, active) => {
    try {
        const users = await userModel(page, limit, active)

        return users
    } catch (err) {
        res.status(500).json({msg: 'Erro ao pegar usuarios em lista'})
    }
};

exports.findByDate = async (req, res) => {
    try {
        const date = req.query.date; 
        const users = await userModel.findByDate(date)

        res.status(200).json(users);
    } catch (err) {
        res.status(400).json({ message: "Ocorreu um erro ao buscar usuários cadastrados na data especificada", error: err });
    }
};