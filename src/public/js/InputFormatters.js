
const formatInput = {
    cpf: (input) =>  {
        input.addEventListener('input', function (e) {
            let cpf = e.target.value.replace(/\D/g, '')
            cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2')
            cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2')
            cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
            e.target.value = cpf;
        });
    },
    tel: (input) => {
        input.addEventListener('input', function (e) {
            let telefone = e.target.value.replace(/\D/g, '')
            telefone = telefone.replace(/^(\d{2})(\d)/g, '($1) $2')
            telefone = telefone.replace(/(\d{5})(\d)/, '$1-$2')
            telefone = telefone.substring(0, 15)
            e.target.value = telefone;
        })
    },
    rg: (input) => {
        input.addEventListener('input', function (e) {
            let rg = e.target.value.replace(/\D/g, '')
            if (rg.length > 8) {
                rg = rg.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4')
            }
            else if (rg.length > 5) {
                rg = rg.replace(/(\d{2})(\d{3})(\d{1,2})/, '$1.$2.$3')
            }
            else {
                rg = rg.substring(0, 5);
            }
            e.target.value = rg;
        });
    },
    date: (input) => {
        input.addEventListener('input', function (e) {
            var data = e.target.value.replace(/\D/g, '')
            data = data.substring(0, 8)
            if (data.length > 4) {
                data = data.replace(/(\d{2})(\d{2})(\d{0,4})/, '$1/$2/$3')
            } else if (data.length > 2) {
                data = data.replace(/(\d{2})(\d{0,2})/, '$1/$2')
            }
            e.target.value = data;
        })
    },
    cep: (input) => {
        input.addEventListener('input', function (e) {
            let cep = e.target.value.replace(/\D/g, '');
            if (cep.length > 5) {
                cep = cep.replace(/^(\d{5})(\d{3})/, '$1-$2')
            }
            cep = cep.substring(0, 9)
            e.target.value = cep;
        })
    }
};






