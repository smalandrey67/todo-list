 'use strict'

//main veribles
const form = document.querySelector('.form')
const sideBar = document.querySelector('.backet')
const modalForm = document.querySelector('.modal__content')
const modal = document.querySelector('#modal')


//input veribles
const inputConfirm = document.querySelector('#input-confirm')
const inputAdd = document.querySelector('#input-add')
const inputSearch = document.querySelector('#input-search')
const inputChange = document.querySelector('.modal__main-input')

//buttos veribles
const buttonConfirm = document.querySelector('#button-confirm')
const buttonAdd = document.querySelector('#button-add')
const sortingButtons = document.querySelectorAll('#sorting-button')
const resetButton = document.querySelector('#reset')
const sideBarOpen = document.querySelector('.header__side-image')
const sideBarCount = document.querySelector('.header__side-count')
const closeModal = document.querySelector('#close')
const closeSideBar = document.querySelector('#backet-close')

//utils veribles
const itemsContainer = document.querySelector('.list')
const deleteList = document.querySelector('.backet__list')
const warning = document.querySelector('.content__warning')
const backetWarning = document.querySelector('.backet__warning')


let tasks = []
let deleteTasks = []

//==== getting data whenever page loads ====//
if(localStorage.getItem('tasks')){
    tasks = [...JSON.parse(localStorage.getItem('tasks'))]

    createItems(tasks)
}

if(localStorage.getItem('deleteTasks')){
    deleteTasks = [...JSON.parse(localStorage.getItem('deleteTasks'))]

    createWarningBacket()
    createDeleteItems(deleteTasks)
}

//==== update local srotage functions ====//
function updateLocalStorage(){
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function updateDeleteItems(){
    localStorage.setItem('deleteTasks', JSON.stringify(deleteTasks))

    createWarningBacket()
}

//==== helper functions ====//
function createWarningBacket(){
    sideBarCount.textContent = deleteTasks.length
}

function updateTodo(filterArray){
    tasks = [...filterArray]

    createItems(tasks)
    updateLocalStorage()
}

function stringValidate(string){
    return string.length >= 20 ? `${string.slice(0, 20)}<span class="list__task-span">...<span>` : string;
}


//submit task
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

//disable (add button) if we don't have any letters inside of input
inputAdd.addEventListener('input', (e) => {
    e.target.value.trim() ? buttonAdd.classList.remove('disable') : buttonAdd.classList.add('disable')
})

inputConfirm.addEventListener('input', (e) => {
    e.target.value.trim() ? buttonConfirm.classList.remove('disable') : buttonConfirm.classList.add('disable')
})


//listener for searching tasks
inputSearch.addEventListener('input', (e) => {
    const visibleItems = tasks.filter(item => item.task.includes(e.target.value.trim().toLowerCase()))

    createItems(visibleItems)
})

//listener for opening sidebar
sideBarOpen.addEventListener('click', () => {
    if(!deleteTasks.length){
        backetWarning.classList.add('backet__warning--active')    
    }
    sideBar.classList.toggle('backet--active')
})

//listener for closing modal
closeModal.addEventListener('click', () => modal.classList.remove('modal--active'))

//reset deleted task inside of side bar 
resetButton.addEventListener('click', () => {
    if(!deleteTasks.length) return

    deleteTasks = []

    backetWarning.classList.add('backet__warning--active')
   
    createWarningBacket()
    createDeleteItems()
    updateDeleteItems()
})

//listener for closing sidebar
closeSideBar.addEventListener('click', () => sideBar.classList.remove('backet--active'))

//==== sorting tasks ====//
sortingButtons.forEach(item => item.addEventListener('click', sortingHanlder))

function sortingHanlder(e){
    //types of sorting
    const DONE = 'DONE_TYPE'
    const IMPORTANT = 'IMPORTANT_TYPE'
    const NOTDONE = 'WAITING_TYPE'
    const ALL = 'ALL_TYPE'

    sortingButtons.forEach(item => item.classList.remove('content__sorting-button__active'))

    //add class to current filter type
    e.target.classList.add('content__sorting-button__active')

    //getting type of sorting from button
    const dataType = e.target.dataset.sorting

    let sortingArray = []

    if(dataType === DONE) sortingArray = tasks.filter(item => item.accomplished) 

        else if(dataType === IMPORTANT) sortingArray = tasks.filter(item => item.important)  

        else if(dataType === NOTDONE) sortingArray = tasks.filter(item => !item.accomplished)
        
        else if(dataType === ALL) sortingArray = tasks
           

    createItems(sortingArray)
}


if(!tasks.length){
    warning.textContent = 'no tasks yet'
    warning.classList.add('content__warning--active')
}else {
    warning.classList.remove('content__warning--active')
}


function createItems(array){
    itemsContainer.innerHTML = ""

    buttonAdd.classList.add("disable")
    warning.classList.remove('content__warning--active')
    warning.textContent = 'no tasks yet'

    if(!array.length){
        warning.classList.add('content__warning--active')
        warning.textContent = 'nothing was found'

        return
    }

    array.forEach(task => {
        itemsContainer.innerHTML += `
        <li class="list__item" data-id="${task.id}">
            <img id="open-modal"  class="list__change" src="images/light-icon.png">
            <h4 class="list__task ${task.accomplished ? 'list__task--accomplished' : ''} ${task.important ? 'list__task--important' : ''}" >${stringValidate(task.task)}</h4>
            <div class="list__functionality">
                <input class="list__functionality-accomplished list__functionality-item input" name="accomplished" ${task.accomplished ? 'checked' : ''} type="checkbox">
                <img class="list__functionality-delete list__functionality-item" src="images/delete-icon.png">
                <img class="list__functionality-important list__functionality-item" src="images/call-icon.png">
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
            <li class="backet__item" data-id="${task.id}">
                <p class="backet__task">${stringValidate(task.task)}</p>
                <div class="backet__functionality">
                    <button class="backet__functionality-return button">return</button>
                </div>
            </li>
        `
    })

    returnFunctionality()
}



const deleteHandler = (id) => {
    const filterArray = tasks.filter(item => item.id !== id)
    const deleteArray = tasks.find(item => item.id === id)

    deleteTasks = [...deleteTasks, deleteArray]

    if(deleteTasks.length){
        backetWarning.classList.remove('backet__warning--active')  
    }

    updateTodo(filterArray)
    createDeleteItems()
    updateDeleteItems()

    if(tasks.length === 0) {
        warning.classList.add('content__warning--active')
        warning.textContent = 'no tasks yet'
    }
}

const accomplishedHandler = (id) => {
    const filterArray = tasks.map(item => item.id === id ? {...item, accomplished: !item.accomplished} : item)

    updateTodo(filterArray)
}

const importantHandler = (id) => {
    const filterArray = tasks.map(item => {
        if(item.id === id){
            if(!item.accomplished){
                return {...item, important: !item.important}
            }
        }
        return item
    })

    updateTodo(filterArray)
}

const changeHandler = (id) => {
    buttonConfirm.classList.add('disable')
    modal.classList.add('modal--active')

    modalForm.addEventListener('submit', changeFunctionality)

    function changeFunctionality(e){ 
        e.preventDefault()
        modal.classList.remove('modal--active')
    
        const filterArray = tasks.map(item => {
            if(item.id === id){
                item.task = inputChange.value.trim().toLowerCase()
            }
            return item
        })
    
        
        inputChange.value = ''
        updateTodo(filterArray)
        modalForm.removeEventListener('submit', changeFunctionality)
    }
}


const returnHandler = (id) => {
    const filterItem = deleteTasks.find(item => item.id === id)

    const filterDeleteItems = deleteTasks.filter(item => item.id !== id)
 
    deleteTasks = [...filterDeleteItems]
    tasks = [filterItem, ...tasks]

    if(!deleteTasks.length){
        backetWarning.classList.add('backet__warning--active')
    }

    createItems(tasks)
    createDeleteItems()
    updateLocalStorage()
    updateDeleteItems()
}

const showAlltask = (e, id) => {
    const listTasks = document.querySelectorAll('.list__task')
    const itemDescription = tasks.find(item => item.id === id)

    if(e.target.textContent.length <= 20) return

    listTasks.forEach(item =>  item.innerHTML = stringValidate(item.textContent))

    e.target.textContent = itemDescription.task
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
                e.target.classList.add('.list__functionality-important__active')
                importantHandler(fieldId)
            }else if(e.target.classList.contains('list__change')){
                changeHandler(fieldId)
            }else if(e.target.classList.contains('list__task')){
                showAlltask(e, fieldId)
            }else return
        })
    })
}

function returnFunctionality(){
    const fieldsContainer = document.querySelectorAll('.backet__item')

    fieldsContainer.forEach(task => {
        task.addEventListener('click', (e) => {
            e.preventDefault()
            const fieldId = +e.target.closest('.backet__item').dataset.id

            if(e.target.classList.contains('backet__functionality-return')){
                returnHandler(fieldId)
            }else return

        })
    })
}










