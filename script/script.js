'use strict'

const inputAdd = document.querySelector('.form__input')
const buttonAdd = document.querySelector('#button-add')
const itemsContainer = document.querySelector('.list')

let staticId = 0
let tasks = []

function updateLocalStorage(){
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

if(localStorage.getItem('tasks')){
    tasks = [...JSON.parse(localStorage.getItem('tasks'))]
    createItems()
}

buttonAdd.addEventListener('click', (e) => {
    e.preventDefault()

    const item = {
        task: inputAdd.value.trim().toLowerCase(),
        important: false,
        accomplished: false,
        id: staticId++,
    }

    tasks = [...tasks, item]

    updateLocalStorage()
    createItems()
})

function createItems(){
    itemsContainer.innerHTML = ""
    tasks.forEach(task => {
        itemsContainer.innerHTML += `
        <li class="list__item" data-id="${task.id}">
            <p class="list__task">${task.task}</p>
            <div class="list__functionality">
                <input class="list__functionality-accomplished input" name="accomplished" ${task.accomplished ? 'checked' : ''} type="checkbox">
                <button class="list__functionality-delete button">delete</button>
                <button class="list__functionality-important button">!</button>
            </div>
        </li>
        `
    })

    addFunctionality()
}


const deleteHandler = (id) => {
    const filterArray = tasks.filter(item => item.id !== id)
    tasks = [...filterArray]

    createItems()
    updateLocalStorage() 
}

const accomplishedHandler = (id) => {
    
}

const importantHandler = (id) => {
    console.log('important', id)
}

function addFunctionality(){
    const fieldContainer = document.querySelectorAll('.list__item')

    fieldContainer.forEach(task => {
        task.addEventListener('click', (e) => {
            e.preventDefault()
            const fieldId = +e.target.closest('.list__item').dataset.id

            if(e.target.classList.contains('list__functionality-delete')){
                deleteHandler(fieldId)
            }else if(e.target.classList.contains('list__functionality-accomplished')){
                accomplishedHandler(fieldId)
            }else if(e.target.classList.contains('list__functionality-important')){
                importantHandler(fieldId)
            }else{
                return
            }

        })
    })
}

















