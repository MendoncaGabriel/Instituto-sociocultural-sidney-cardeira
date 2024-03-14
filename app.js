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

app.use((req, res, next) => {
    console.log(req.body);
    next();
});


//CONFIGURAÃO DA PASTA VIEWS PARA ARQUIVOS EJS
app.set('views', path.join(__dirname,'src', 'views'));
app.set('view engine', 'ejs');

//CONFIGURAÇÃO DA PASTA PUBLIC PARA SERVIR ARQUIVOS ESTÁTICOS
app.use(express.static(path.join(__dirname,'src', 'public')));



//ROTAS
const indexRouter = require('./src/routes/index.router')
const adminRouter = require('./src/routes/admin.router')
app.use('/admin', adminRouter)
app.use('/', indexRouter)


const PORT = process.env.PORT || 3002
app.listen(PORT,()=>{
    console.log(`Servidor aberto http://localhost:${PORT}`)
})