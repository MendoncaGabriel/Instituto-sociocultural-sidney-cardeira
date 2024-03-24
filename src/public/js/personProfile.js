function closePopUpAddNewDependent(){
    document.querySelector('#popupDependent').classList.add('hidden')
}
function openPopUpAddNewDependent(){
    document.querySelector('#popupDependent').classList.remove('hidden')
}

function addNewDependent(id){
    const form = document.querySelector('#formNewDependent')
    const formData = new FormData(form); 


    const jsonData = {};
    formData.forEach((value, key) => {
        jsonData[key] = value;
    });
    console.log(jsonData)

    fetch(`/user/addNewDependent/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData) 
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
    
         window.location.reload()
    })
    .catch(error => {
        console.error('Erro ao enviar formulário:', error);
    });
}