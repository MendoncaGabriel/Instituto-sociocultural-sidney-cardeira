const express = require('express')
const cookieParser = require('cookie-parser');
const compression = require( 'compression' )
const cors = require('cors')
const path = require('path');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
require('dotenv').config()
require('./src/models/database')

const app = express()

//MIDDLEWARES
    app.use(express.json());
    app.use(compression())
    app.use(cors())
    app.use(cookieParser());



//CONFIGURAÃO DA PASTA VIEWS PARA ARQUIVOS EJS
    app.set('views', path.join(__dirname,'src', 'views'));
    app.set('view engine', 'ejs');

//CONFIGURAÇÃO DA PASTA PUBLIC PARA SERVIR ARQUIVOS ESTÁTICOS
    app.use(express.static(path.join(__dirname,'src', 'public')));


       

//ROTAS
    const pageRouter = require('./src/routes/pageRouter')
    const userRouter = require('./src/routes/userRouter')
    const servicesRouter = require('./src/routes/serviceRouter')
    const authRouter = require('./src/routes/authRouter')

    app.use('/auth', authRouter)


    // Middleware para verificar se o usuário está logado
    app.use(async (req, res, next) => {
        const token = req.cookies.token;

        // Verifica se o token existe
        if (!token) {
            return res.render('login');
        }

        try {
            // Verifica se o token é válido
            const decoded = jwt.verify(token, process.env.SECRET);

            // Se o token for válido, o usuário está logado
            console.log("Usuário está logado!");
            next();
        } catch (error) {
            // Se ocorrer um erro ao verificar o token, redirecione para a página de login
            console.error("Erro ao verificar o token:", error.message);
            res.render('login');
        }
    });


   
    app.use('/services', servicesRouter)
    app.use('/user', userRouter)
    app.use('/', pageRouter)




const PORT = process.env.PORT || 3002
app.listen(PORT,()=>{
    console.log(`Servidor aberto http://localhost:${PORT}`)
})