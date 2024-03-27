const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

module.exports = {
    checkAdmin: async (user) => {
        if (user.user == process.env.USER_ADMIN && user.pass == process.env.PASS_ADMIN) {
            // Geração do token
            const secret = process.env.SECRET;
            const token = jwt.sign(
                {
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
        } else {
            return { status: false, msg: 'Credenciais inválidas' };
        }
    }
};