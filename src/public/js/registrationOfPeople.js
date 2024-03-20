

const form = document.querySelector('#formCreate')

form.addEventListener('submit', event => {
  event.preventDefault();
  const formData = new FormData(form); 
  

  fetch('/user/create', {
    method: 'POST',
    body: formData 
  })
  .then(res => res.json())
  .then(data => {
    console.log(data);
    // window.location.href = '/lista-de-pessoas'
  })
  .catch(error => {
    console.error('Erro ao enviar formulário:', error);
  });
});

function scrollToBottom() {
  document.querySelector('main').scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth' // Esta linha é opcional e faz com que a rolagem seja suave
  });
}


function addNewDependent(){
  const element = `
  <div class="border my-5 shadow-md px-4 py-2">
    <!-- Controles -->
    <div class="flex items-center justify-between w-full  mb-10">
      <span class=" text-gray-600 text-lg ">Dependente:</span>
      <button type="button" onclick="removeDependent(this)" class="px-4 py-1 text-white rounded-md hover:shadow-md bg-red-500 hover:bg-red-600">Remover</button>
    </div>

    <!-- Formulario de dependente -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-5">
      <div class="block w-full">
        <label for="" class="block text-sm text-gray-500">Nome:  <span class="text-red-500 ">*</span></label>
        <input required type="text" name="name_dependent" class="w-full px-4 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 focus:l">
      </div>
      <div class="block w-full">
        <label for="" class="block text-sm text-gray-500">RG:</label>
        <input type="text" name="rg_dependent" class="w-full px-4  border-b-2 border-gray-300 focus:outline-none focus:border-blue-500">
      </div>
      <div class="block w-full">
        <label for="" class="block text-sm text-gray-500">CPF:</label>
        <input type="text" name="cpf_dependent" class="w-full px-4  border-b-2 border-gray-300 focus:outline-none focus:border-blue-500">
      </div>
      <div class="block w-full">
        <label required for="" class="block text-sm text-gray-500">Data de Nacimento:  <span class="text-red-500 ">*</span></label>
        <input type="text" name="dateOfBirth_dependent" class="w-full px-4  border-b-2 border-gray-300 focus:outline-none focus:border-blue-500">
      </div>
      <div class="block w-full">
        <label for="" class="block text-sm text-gray-500">Imagem:</label>
        <div class="text-md bg-gray-200 border-2 border-gray-500 active:border-blue-500  px-4 w-48 h-10 py-2 rounded-lg text-gray-600 relative"> 
          <span class="text-sm w-full h-ful flex items-center justify-center">Selecione uma imagem</span>   
          <input type="file" name="image" class="w-48 h-10 overflow-hidden p-0 border border-red-700 absolute top-0 left-0 opacity-0">
        </div>
      </div>
    </div>
  
  </div>`


  const containerDependents = document.querySelector('#containerDependents')

  containerDependents.innerHTML += element

  scrollToBottom()
}


function removeDependent(element){
  element.parentNode.parentNode.remove()

}



// CONSULTA CEP
const cep = document.querySelector('[name="cep"]')
cep.addEventListener('blur', () => {
  const url = `https://viacep.com.br/ws/${cep.value}/json/`;
  
  fetch(url)
  .then(res => res.json())
  .then(data => {
    if (data.erro) {
      return alert('CEP não encontrado')
    } else {

      data.logradouro ? document.querySelector('[name="publicPlace"]').value = data.logradouro : ''
      data.bairro ? document.querySelector('[name="neighborhood"]').value = data.bairro : ''
      data.localidade ? document.querySelector('[name="city"]').value = data.localidade : ''
      data.uf ? document.querySelector('[name="uf"]').value = data.uf : ''
    }
  })
  .catch(error =>  alert('Erro ao consultar CEP'));
})