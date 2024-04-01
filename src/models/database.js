const mongoose = require('mongoose')
require('dotenv').config()
const DATABASE_URL = process.env.DATABASE_URL || `mongodb+srv://gabrielandrade05081997:2gnHgBzAXjNeM3XJ@cluster0.baicaa5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

module.exports = mongoose.connect(DATABASE_URL)
.then(()=>{
    console.log('Conectado ao Database!')
})
.catch((err)=>{
    console.log('Erro ao se conectar a Database:', err)
})