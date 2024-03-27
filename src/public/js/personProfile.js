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

function remove(){

}

function assignService(idUser){
    const idService = document.getElementById('inputAssignService')

    fetch(`/user/assignService/${idUser}/${idService.value}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        
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

function removeAssignment(idUser, idService){
    console.log(idUser, idService)
    fetch(`/user/removeAssignment/${idUser}/${idService}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        
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