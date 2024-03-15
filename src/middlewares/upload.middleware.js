const multer = require('multer');
const path = require('path');



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/images')); // O diretório onde os arquivos serão armazenados
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) 
  }
});

// Middleware para upload de arquivo
module.exports = multer({ storage: storage });



