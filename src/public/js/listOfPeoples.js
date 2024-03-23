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
    

    fetch(`/user/getFilter${paramsFilter}`, {
        method: 'GET',
        headers:{'Content-Type': 'application/json'}
    })
    .then(res => res.json())
    .then(res =>{
        console.log(res)
    })
    .catch((err)=>{
        console.log(err)
    })
}