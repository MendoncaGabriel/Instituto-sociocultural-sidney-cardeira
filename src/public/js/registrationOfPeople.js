

const form = document.querySelector('#formCreate')

form.addEventListener('submit', event => {
    event.preventDefault();

    const formData = new FormData(form); 

    const userSchemaObject = {
      name: formData.get('name'),
      whatsapp: formData.get('whatsapp') == 'on' ? true : false,
      email: formData.get('email'),
      rg: formData.get('rg'),
      cpf: formData.get('cpf'),
      tel: formData.get('tel'),
      dateOfBirth: formData.get('dateOfBirth'),
      address: {
        publicPlace: formData.get('publicPlace'),
        cep:  formData.get('cep'),
        neighborhood:  formData.get('neighborhood'),
        city:  formData.get('city'),
        uf:  formData.get('uf'),
        country:  formData.get('country'),
        houseNumber:  formData.get('houseNumber')
      },
      dependents: [],
    };



    const dependentNames = formData.getAll('name_dependent');
    const dependentRgs = formData.getAll('rg_dependent');
    const dependentCpfs = formData.getAll('cpf_dependent');
    const dependentDatesOfBirth = formData.getAll('dateOfBirth_dependent');
    const dependentImages = formData.getAll('image_dependent');
  
    for (let i = 0; i < dependentNames.length; i++) {
      userSchemaObject.dependents.push({
        name: dependentNames[i],
        rg: dependentRgs[i],
        cpf: dependentCpfs[i],
        dateOfBirth: dependentDatesOfBirth[i],
        image: dependentImages[i]
      });
    }

    console.log(userSchemaObject)






    // fetch('/user/create', {
    //     method: 'POST',
    //     body: formData 
    // })
    // .then(response => {
    //     if (!response.ok) {
    //         throw new Error('Erro ao enviar formulário');
    //     }
    //     return response.json();
    // })
    // .then(data => {
    //     console.log(data);
    //    // window.location.href = '/lista-de-pessoas'

    // })
    // .catch(error => {
    //     console.error('Erro:', error);
    // });
});

