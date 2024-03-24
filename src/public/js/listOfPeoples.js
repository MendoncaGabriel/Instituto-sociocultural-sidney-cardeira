document.querySelectorAll('.redirect').forEach((e)=>{
    e.addEventListener('click', (e)=>{
        window.location.href = `/perfil?id=${e.target.parentNode.id}`
    })
})


function filter(){
    let name = document.querySelector("#name")
    let tel = document.querySelector("#tel")
    let cpf = document.querySelector("#cpf")

    let paramsFilter = "";

    if (name.value.length > 0) {
        paramsFilter += `?name=${name.value}`;
    }
    
    if (tel.value.length > 0) {
        paramsFilter += (paramsFilter.length > 0 ? "&" : "?") + `tel=${tel.value}`;
    }
    
    if (cpf.value.length > 0) {
        paramsFilter += (paramsFilter.length > 0 ? "&" : "?") + `cpf=${cpf.value}`;
    }
    

    fetch(`/user/findByFilter${paramsFilter}`, {
        method: 'GET',
        headers:{'Content-Type': 'application/json'}
    })
    .then(res => res.json())
    .then(res =>{
        console.log(res)
        renderList(res)
    })
    .catch((err)=>{
        console.log(err)
    })
}


function renderList(data){
    const listOfPeoples = document.getElementById('listOfPeoples')
    listOfPeoples.innerHTML = ''

    function formatarTelefone(telefone) {
        // Remove todos os caracteres não numéricos
        const numeros = telefone.replace(/\D/g, '');
    
        // Formata o telefone conforme necessário
        if (numeros.length === 10) {
            return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        } else if (numeros.length === 11) {
            return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else {
            return telefone; // Retorna o número original se não for possível formatar
        }
    }

    function formatarCPF(cpf) {
        // Verifica se o CPF é válido
        if (!cpf || cpf.length !== 11) {
            return cpf; // Retorna o CPF original se não for válido
        }
    
        // Formata o CPF com pontos e hífen
        return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
    }

    data.forEach((e)=>{
        const date = new Date(e.createdAt)
        document.getElementById('listOfPeoples').innerHTML += `
        <tr id="${e._id}" class="bg-gray-50  hover:bg-gray-200 border-b   relative">
            <th  scope="row" class="redirect px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">             
                ${e.name}
            </th>
            <td class="px-6 py-4 redirect">
                ${formatarTelefone(e.tel)}
            </td>
            <td class="px-6 py-4 redirect">
                ${formatarCPF(e.cpf)}
            </td>
            <td class="px-6 py-4 redirect">
                ${e.rg}
            </td>
            <td class="px-6 py-4 redirect">
                ${e.dateOfBirth}
            </td>
            <td class="px-6 py-4 redirect">
    
                ${`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} - ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`}
            </td>
            <td class="px-6 py-4 flex justify-center">
                <a class="text-white font-semibold px-4 py-2 m-auto  bg-blue-500" href="/editar-cadastro?id=${e._id}">EDITAR</a>
            </td>
        </tr>
        `
    })
}