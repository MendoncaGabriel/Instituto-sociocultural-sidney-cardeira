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

// Middleware para upload de arquivo unico
// module.exports = multer({ storage: storage });

// Middleware para upload de multiplos arquivos
module.exports = multer({ storage: storage }).array('image', 5); // 'images' é o nome do campo do formulário para as imagens, e 5 é o número máximo de arquivos permitidos (ajuste conforme necessário)


