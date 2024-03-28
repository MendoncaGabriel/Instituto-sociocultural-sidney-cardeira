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
    const personRouter = require('./src/routes/personRouter')
    const servicesRouter = require('./src/routes/serviceRouter')
    const authRouter = require('./src/routes/authRouter')
    const userRouter = require('./src/routes/userRouter')

    app.use('/auth', authRouter)


    // Middleware para verificar se o usuário está logado
    app.use(async (req, res, next) => {
        const token = req.cookies.token;
        if (!token) {
            return res.render('login');
        }

        try {
            const decoded = jwt.verify(token, process.env.SECRET);
            if(decoded){
                console.log(decoded.type)
                res.locals.typeUser = decoded.type
                console.log("Usuário está logado!");
                // console.log(decoded)
                next();
                return
            }
           
            res.render('login');
        } catch (error) {
            console.error("Erro ao verificar o token:", error.message);
            res.render('login');
        }
    });


   
    app.use('/user', userRouter)
    app.use('/services', servicesRouter)
    app.use('/user', personRouter)
    app.use('/', pageRouter)




const PORT = process.env.PORT || 3002
app.listen(PORT,()=>{
    console.log(`Servidor aberto http://localhost:${PORT}`)
})