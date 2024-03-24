const inputFile = document.getElementById('inputFile');
// Obtém referência para o elemento img
const previewImage = document.getElementById('previewImage');

// Adiciona um evento de mudança ao input file
inputFile.addEventListener('change', function() {
    // Verifica se algum arquivo foi selecionado
    if (this.files && this.files[0]) {
        // Cria um objeto URL para representar o arquivo selecionado
        const reader = new FileReader();
        reader.onload = function(e) {
            // Define o src da imagem para a URL do arquivo
            previewImage.src = e.target.result;
        }
        // Lê o arquivo como uma URL
        reader.readAsDataURL(this.files[0]);
    }
});