'use strict'

const form = document.querySelector('.form')

const inputAdd = document.querySelector('#input-add')
const inputSearch = document.querySelector('#input-search') 

const buttonAdd = document.querySelector('#button-add')
const sortingButtons = document.querySelectorAll('#sorting-button')
const resetButton = document.querySelector('#reset')

const itemsContainer = document.querySelector('.list')
const deleteList = document.querySelector('.delete')
const warning = document.querySelector('.list__warning')

let tasks = []
let deleteTasks = []


function updateLocalStorage(){
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function updateDeleteItems(){
    localStorage.setItem('deleteTasks', JSON.stringify(deleteTasks))
}

if(localStorage.getItem('tasks')){
    tasks = [...JSON.parse(localStorage.getItem('tasks'))]

    createItems(tasks)
}

if(localStorage.getItem('deleteTasks')){
    deleteTasks = [...JSON.parse(localStorage.getItem('deleteTasks'))]

    createDeleteItems(deleteTasks)
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

function createDeleteItems(){
    deleteList.innerHTML = ''
    deleteTasks.forEach(task => {
        deleteList.innerHTML += `
            <li class="delete__item" data-id="${task.id}">
                <p class="delete__task ${task.accomplished ? 'list__task--accomplished' : ''} ${task.important ? 'list__task--important' : ''}" >${task.task}</p>
                <div class="delete__functionality">
                    <button class="delete__functionality-return button">return</button>
                </div>
            </li>
        `
    })

    returnFunctionality()
}

const updateTodo = (filterArray) => {
    tasks = [...filterArray]

    createItems(tasks)
    updateLocalStorage()
}

const deleteHandler = (id) => {
    const filterArray = tasks.filter(item => item.id !== id)
    const deleteArray = tasks.find(item => item.id === id)

    deleteTasks = [...deleteTasks, deleteArray]
   
    updateTodo(filterArray)
    createDeleteItems()
    updateDeleteItems()

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
                item.task = inputChange.value.trim().toLowerCase()
            }
            return item
        })

        updateTodo(filterArray)
    })
}

const returnHandler = (id) => {
    const filterItem = deleteTasks.find(item => item.id === id)
    const filterDeleteItems = deleteTasks.filter(item => item.id !== id)
 
    deleteTasks = [...filterDeleteItems]
    tasks = [...tasks, filterItem]

    createItems(tasks)
    createDeleteItems()
    updateLocalStorage()
    updateDeleteItems()
}


resetButton.addEventListener('click', () => {
    deleteTasks = []

    updateDeleteItems()
    createDeleteItems()
})

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

function returnFunctionality(){
    const fieldsContainer = document.querySelectorAll('.delete__item')

    fieldsContainer.forEach(task => {
        task.addEventListener('click', (e) => {
            e.preventDefault()
            const fieldId = +e.target.closest('.delete__item').dataset.id

            if(e.target.classList.contains('delete__functionality-return')){
                returnHandler(fieldId)
            }else return
        })
    })
}











