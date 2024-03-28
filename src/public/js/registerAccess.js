function addNewUser() {

    fetch('/user', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            user: document.querySelector('#user').value,
            pass: document.querySelector('#pass').value
        })
    })
    .then(res => res.json())
    .then(res => {
        window.location.reload()
        console.log(res)
    })
}

function edit(id, user, password){
    document.querySelector('#user').value = user
    document.querySelector('#pass').value = password
    document.querySelector('#pass').type = 'text'
    document.querySelector('#btnRegister').innerText = 'SALVAR'
    document.querySelector('#btnRegister').setAttribute('onclick', `saveEdit('${id}')`)
}

function saveEdit(id){
    const data = {
        user: document.querySelector('#user').value,
        pass: document.querySelector('#pass').value 
    }


    fetch(`/user/${id}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
        console.log(res)
        window.location.reload()
    })
}

function removerUser(id){
    const res = prompt('Remover acesso deste usuário?: sim / não')
    if(res != 'sim') return 

    fetch(`/user/${id}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'}
    })
    .then(r => r.json())
    .then(res => {
        console.log(res)
        window.location.reload()
    })
}



document.querySelectorAll('.viewPass').forEach(e => {
    e.addEventListener('mouseenter', (event) => {
        e.childNodes[1].classList.add('hidden');
        e.childNodes[3].classList.remove('hidden');
    });

    e.addEventListener('mouseleave', (event) => {
        e.childNodes[1].classList.remove('hidden');
        e.childNodes[3].classList.add('hidden');
    });
});

