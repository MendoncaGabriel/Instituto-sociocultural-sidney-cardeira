//CARREGAR IMAGEM DO INPUT
const inputFile = document.getElementById('inputFile');
const previewImage = document.getElementById('previewImage');

inputFile.addEventListener('change', function() {
  if (this.files && this.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      previewImage.src = e.target.result;
    }
    reader.readAsDataURL(this.files[0]);
  }
});

//ENVIAR ATUALIZAÇÃO
function dependentUpdate(id){
  const form = document.querySelector('#formEditDependent')
  const formData = new FormData(form); 


  const params = new URLSearchParams(window.location.search);
  const personId = params.get('id');
  

  fetch(`/user/dependentUpdate?id=${id}&personId=${personId}`, {
    method: 'POST',
    body: formData 
  })
  .then(res => res.json())
  .then(data => {
    console.log(data);
   
    window.location.href = `/perfil?id=${data.userId}`
  })
  .catch(error => {
    console.error('Erro ao enviar formulário:', error);
  });
}

//DESATIVAR DEPENDENT
function deactivateDependent(id){
  const res= prompt('Desativar usuario?: SIM / NÃO')

  if(res.toLocaleLowerCase() == 'sim'){
    fetch(`/user/disactivateDependent?id=${id}`, {
      method: 'GET',
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      console.log(data)
      //window.history.back()
      window.location.href = `/perfil?id=${data.updatedUser}`
    })
    .catch(error => {
      console.error('Erro ao enviar formulário:', error);
    });

  }else if(res.toLocaleLowerCase().replace('ã', 's') != 'nao'){
    alert('Por favor digite: sim ou não')
  }
}
