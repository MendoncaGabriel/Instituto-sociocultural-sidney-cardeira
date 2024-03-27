function create(){
    fetch('/services',{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            name: document.querySelector('#service').value,
        })
    })
    .then(res => res.json())
    .then((res) => {
        console.log(res)
        window.location.reload()
    })
}

function deleteService(id){
    const res = prompt('Tem certeza que deseja remover?: sim / não')
    if(res.toLocaleLowerCase().replace('ã', '') == 'sim'){

        fetch(`/services/${id}`,{
            method: 'DELETE',
        })
        .then(res => res.json())
        .then((res) => {
            console.log(res)
            window.location.reload()
        })
    }
}

function updateService(id, name){
    document.querySelector('#service').value = name
    document.querySelector('#btnNovo').innerText = 'ATUALIZAR'
    document.querySelector('#btnNovo').setAttribute('onclick', `update('${id}')`)
}
function update(id){
    fetch(`/services/${id}`,{
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            name: document.querySelector('#service').value
        })
    })
    .then(res => res.json())
    .then((res) => {
        console.log(res)
        window.location.reload()
    })
}