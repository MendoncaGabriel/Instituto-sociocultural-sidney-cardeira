const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userSchema = require('../models/schema/userSchema')

module.exports = {
    checkAdmin: async (user) => {
        // LOGIN DE ADMIN
        if (user.user == process.env.USER_ADMIN && user.pass == process.env.PASS_ADMIN) {
            // Geração do token
            const secret = process.env.SECRET;
            const token = jwt.sign(
                {
                    type: user.user = 'admin',
                    user: user.user,
                    date: Date.now()
                },
                secret
            );

            if (token) {
                return { status: true, token };
            } else {
                return { status: false, msg: 'Erro ao gerar token' };
            }
        } 
        // LOGIN USUARIO
        else if(user.user, user.pass){
            const userAccess = await userSchema.find({user: user.user})
            console.log(userAccess)
            if(!userAccess){
                return { status: false, msg: 'Credenciais inválidas' };
            }
    
            if(userAccess.length > 0 && userAccess[0].password == user.pass){
                // Geração do token
                const secret = process.env.SECRET;
                const token = jwt.sign(
                    {
                        type: user.user = 'user',
                        user: user.user,
                        date: Date.now()
                    },
                    secret
                );
                return { status: true, token };
            }
            return { status: false, msg: 'Credenciais inválidas' };
        }
        else {
            return { status: false, msg: 'Credenciais inválidas' };
        }
    }
};