'use strict'

const form = document.querySelector('.form')

//inputs
const inputAdd = document.querySelector('#input-add')
const inputSearch = document.querySelector('#input-search') 

//buttons
const buttonAdd = document.querySelector('#button-add')
const sortingButtons = document.querySelectorAll('#sorting-button')

const itemsContainer = document.querySelector('.list')
const warning = document.querySelector('.list__warning')

let tasks = []

function updateLocalStorage(){
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

if(localStorage.getItem('tasks')){
    tasks = [...JSON.parse(localStorage.getItem('tasks'))]

    createItems(tasks)
}

if(!tasks.length){
    warning.textContent = 'no tasks yet'
    warning.classList.add('list__warning--active')
}else {
    warning.classList.remove('list__warning--active')
}

//disable add button if we don't have any letters inside of input
inputAdd.addEventListener('input', (e) => {
    e.target.value.trim() ? buttonAdd.classList.remove("disable") : buttonAdd.classList.add("disable");
})

//search tasks
inputSearch.addEventListener('input', (e) => {
    const visibleItems = tasks.filter(item => item.task.includes(e.target.value.trim().toLowerCase()))


    createItems(visibleItems)
})

//sorting functionality
sortingButtons.forEach(item => {
    item.addEventListener('click', sortingHanlder)
}) 

function sortingHanlder(e){
   const dataType = e.target.dataset.sorting
   let sortingArray = []

   if(dataType === 'done'){
       sortingArray = tasks.filter(item => item.accomplished)
   }else if(dataType === 'important'){
        sortingArray = tasks.filter(item => item.important)
   }else if(dataType === 'waite'){
        sortingArray = tasks.filter(item => !item.accomplished)
   }else if(dataType === 'all'){
        sortingArray = tasks
   }
   
   createItems(sortingArray)
}



form.addEventListener('submit', (e) => {
    e.preventDefault()

    if(!inputAdd.value.trim().length) return

    const item = {
        task: inputAdd.value.trim().toLowerCase(),
        important: false,
        accomplished: false,
        id: new Date().getMilliseconds(),
    }

    tasks = [...tasks, item]

    updateLocalStorage()
    createItems(tasks)
})

function createItems(array){
    itemsContainer.innerHTML = ""

    buttonAdd.classList.add("disable")
    warning.classList.remove('list__warning--active')
    warning.textContent = 'no tasks yet'

    if(!array.length){
        warning.classList.add('list__warning--active')
        warning.textContent = 'nothing was found'

        return
    }

    array.forEach(task => {
        itemsContainer.innerHTML += `
        <li class="list__item" data-id="${task.id}">
            <button class="list__change button">change</button> 
            <p class="list__task ${task.accomplished ? 'list__task--accomplished' : ''} ${task.important ? 'list__task--important' : ''}" >${task.task}</p>
            <div class="list__functionality">
                <input class="list__functionality-accomplished input" name="accomplished" ${task.accomplished ? 'checked' : ''} type="checkbox">
                <button class="list__functionality-delete button">delete</button>
                <button class="list__functionality-important button">!</button>
            </div>
        </li>
        `
    })

    addFunctionality()
    inputAdd.value = ''
}

const updateTodo = (filterArray) => {
    tasks = [...filterArray]

    createItems(tasks)
    updateLocalStorage()
}


const deleteHandler = (id) => {
    const filterArray = tasks.filter(item => item.id !== id)

    updateTodo(filterArray)
    if(tasks.length === 0) {
        warning.classList.add('list__warning--active')
        warning.textContent = 'no tasks yet'
    }
}

const accomplishedHandler = (id) => {
    const filterArray = tasks.map(item => item.id === id ? {...item, accomplished: !item.accomplished} : item)

    updateTodo(filterArray)
}

const importantHandler = (id) => {
    const filterArray = tasks.map(item => item.id === id ? {...item, important: !item.important} : item)
    
    updateTodo(filterArray)
}

const changeHandler = (id) => {
    const inputChange = document.querySelector('.todo__change')
    const buttonConfirm = document.querySelector('.todo__confirm')
    
    inputChange.classList.add('todo__change--active')


    buttonConfirm.addEventListener('click', () => {
        // if(!inputChange.value) return

        const filterArray = tasks.map(item => {
      
            if(item.id === id){
                item.task = inputChange.value
            }
            return item
        })

        updateTodo(filterArray)
    })
}

function addFunctionality(){
    const fieldsContainer = document.querySelectorAll('.list__item')

    fieldsContainer.forEach(task => {
        task.addEventListener('click', (e) => {
            e.preventDefault()
            const fieldId = +e.target.closest('.list__item').dataset.id

            if(e.target.classList.contains('list__functionality-delete')){
                deleteHandler(fieldId)
            }else if(e.target.classList.contains('list__functionality-accomplished')){
                accomplishedHandler(fieldId)
            }else if(e.target.classList.contains('list__functionality-important')){
                importantHandler(fieldId)
            }else if(e.target.classList.contains('list__change')){
                changeHandler(fieldId)
            }else return
        })
    })
}











