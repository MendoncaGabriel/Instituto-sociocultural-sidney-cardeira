const express = require('express')
const compression = require( 'compression' )
const cors = require('cors')
const path = require('path');
require('dotenv').config()
require('./src/models/database')

const app = express()

//MIDDLEWARES
    app.use(express.json());
    app.use(compression())
    app.use(cors())

//CONFIGURAÃO DA PASTA VIEWS PARA ARQUIVOS EJS
    app.set('views', path.join(__dirname,'src', 'views'));
    app.set('view engine', 'ejs');

//CONFIGURAÇÃO DA PASTA PUBLIC PARA SERVIR ARQUIVOS ESTÁTICOS
    app.use(express.static(path.join(__dirname,'src', 'public')));

//ROTAS
    const pageRouter = require('./src/routes/pageRouter')
    const userRouter = require('./src/routes/userRouter')
    const servicesRouter = require('./src/routes/serviceRouter')
    app.use('/services', servicesRouter)
    app.use('/user', userRouter)
    app.use('/', pageRouter)


const PORT = process.env.PORT || 3002
app.listen(PORT,()=>{
    console.log(`Servidor aberto http://localhost:${PORT}`)
})