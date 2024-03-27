function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}





function login() {
    fetch('/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user: document.getElementById('user').value,
            pass: document.getElementById('pass').value
        }) 
    })
    .then(res => res.json())
    .then(data => {
        console.log(data)
        if(data.token && data.token.length > 0){
     
            setCookie('token', data.token, 30);
            window.location.reload()
        }else{
            alert('Usuário ou senha são invalidos!')
        }
    })
    .catch(error => {
        console.error('Erro interno no servidor', error);
    });
}
