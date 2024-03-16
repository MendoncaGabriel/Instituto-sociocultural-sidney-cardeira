const express = require('express')
const compression = require( 'compression' )
const cors = require('cors')
const path = require('path');

require('dotenv').config()
require('./src/database/connect')

const app = express()

app.use(express.json());

//MIDDLEWARES
app.use(compression())
app.use(cors())



//CONFIGURAÃO DA PASTA VIEWS PARA ARQUIVOS EJS
app.set('views', path.join(__dirname,'src', 'views'));
app.set('view engine', 'ejs');

//CONFIGURAÇÃO DA PASTA PUBLIC PARA SERVIR ARQUIVOS ESTÁTICOS
app.use(express.static(path.join(__dirname,'src', 'public')));



//ROTAS
const pageRouter = require('./src/routes/page.router')
const adminRouter = require('./src/routes/admin.router')
const userRouter = require('./src/routes/user.router ')
app.use('/user', userRouter)
app.use('/admin', adminRouter)
app.use('/', pageRouter)


const PORT = process.env.PORT || 3002
app.listen(PORT,()=>{
    console.log(`Servidor aberto http://localhost:${PORT}`)
})