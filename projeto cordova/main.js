
const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}


const getLocalStorage = () => JSON.parse(localStorage.getItem('database_cliente')) ?? []
const setLocalStorage = (databaseCliente) => localStorage.setItem("database_cliente", JSON.stringify(databaseCliente))

// CRUD - create read update delete.. aqui começa!
const deletaCliente = (index) => {
    const databaseCliente = leiaCliente()
    databaseCliente.splice(index, 1)
    setLocalStorage(databaseCliente)
}

const atualizaCliente = (index, client) => {
    const databaseCliente = leiaCliente()
    databaseCliente[index] = client
    setLocalStorage(databaseCliente)
}

const leiaCliente = () => getLocalStorage()

const criaCliente = (client) => {
    const databaseCliente = getLocalStorage()
    databaseCliente.push (client)
    setLocalStorage(databaseCliente)
}

const validacao = () => {
    return document.getElementById('form').reportValidity()
}

//vai fazer a interação com o layout

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('nome').dataset.index = 'new'
}

const salvaCliente = () => {
    debugger
    if (validacao()) {
        const client = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            celular: document.getElementById('celular').value,
            cidade: document.getElementById('cidade').value
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {
            criaCliente(client)
            updateTable()
            closeModal()
        } else {
            atualizaCliente(index, client)
            updateTable()
            closeModal()
        }
    }
}

const createRow = (client, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.email}</td>
        <td>${client.celular}</td>
        <td>${client.cidade}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `
    document.querySelector('#tableClient>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableClient>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const databaseCliente = leiaCliente()
    clearTable()
    databaseCliente.forEach(createRow)
}

const fillFields = (client) => {
    document.getElementById('nome').value = client.nome
    document.getElementById('email').value = client.email
    document.getElementById('celular').value = client.celular
    document.getElementById('cidade').value = client.cidade
    document.getElementById('nome').dataset.index = client.index
}

const editClient = (index) => {
    const client = leiaCliente()[index]
    client.index = index
    fillFields(client)
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editClient(index)
        } else {
            const client = leiaCliente()[index]
            const response = confirm(`Deseja realmente excluir ${client.nome}`) 
            if (response) {
                deletaCliente(index)
                updateTable()
            }
        }
    }
}

updateTable()

// Eventos
document.getElementById('cadastrarCliente')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', salvaCliente)

document.querySelector('#tableClient>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)