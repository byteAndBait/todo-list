import "../css/main.css"
import "../css/normalize.css"
import { clearLocal, createTodo, EditATodo, viewATodo, removeATodo, createProject, removeProject, viewAProject, viewAllProjects } from "../coreLogic/todoList.js"
import { format } from "date-fns"
const projectsList = document.querySelector("nav.sideBar .projectsList")
const mainContentElement = document.querySelector("main.content")
const createTodoDialog = document.querySelector("#createTodoDialog")
const createProjectInput = document.querySelector(".createProjectInput")
let defaultProjectTodos = {}
const defaultProjectName = "All Todos"
let Projects = viewAllProjects()

function updateProjectsList() {
    projectsList.textContent = ''
    const projectNames = [];
    
    Projects = viewAllProjects()

    for (let i in Projects) {
        const project = Projects[i]
        projectNames.push(project.name)

        defaultProjectTodos = Object.assign(defaultProjectTodos,Projects[i].todos)
    }

    projectsList.appendChild(createProjectTile(defaultProjectName))

    for (let i in projectNames) {
        const projectName = projectNames[i]
        const projectTileElement = createProjectTile(projectName)
        projectsList.appendChild(projectTileElement)
    }





    function createProjectTile(projectName) {
        const projectTile = document.createElement("div")
        projectTile.classList.add("projectTile")
        projectTile.dataset.projectName = projectName

        const projectNameElement = document.createElement("div")
        projectNameElement.classList.add("projectName")
        projectNameElement.textContent = projectName
        projectTile.appendChild(projectNameElement)

        if (!(projectName === defaultProjectName)) {
            const removeButton = document.createElement("button")
            removeButton.textContent = "x"
            removeButton.classList.add("removeProjectButton")
            projectTile.appendChild(removeButton)
        }

        return projectTile
    }
}
export function setupUI() {
    updateScreen()
    createTodoDialogPopulator()
    createTodoDialogHandler()
    createTodoButtonHandler()
    createProjectButtonHandler()

}
function updateScreen() {
    updateProjectsList()
    mainContentElement.textContent =""
    projectsList.addEventListener("click", (e) => {
        if (e.target.classList.contains("projectName")) {
            showContentOfAProject(e.target.parentElement.dataset.projectName)

            projectsList.childNodes.forEach((child) => {
                child.classList.remove("active")
            })
            e.target.parentElement.classList.toggle("active")
        }
        if (e.target.classList.contains("removeProjectButton")) {
            removeProject(e.target.parentElement.dataset.projectName)
            createTodoDialogPopulator()
            updateScreen()
        }
    })

    mainContentElement.addEventListener("click", (e) => {
        const element = e.target
        if (element.classList.contains("todoCompletion")) {
            if (element.checked) {
                EditATodo(element.parentElement.dataset.projectName, element.parentElement.dataset.todoTitle, "completed", true)
                element.parentElement.classList.add("todoCompleted")
            } else if (element.checked === false) {
                EditATodo(element.parentElement.dataset.projectName, element.parentElement.dataset.todoTitle, "completed", false)
                element.parentElement.classList.remove("todoCompleted")
            }
        }
    })
}
function showContentOfAProject(projectName) {
    Projects = viewAllProjects()

    mainContentElement.textContent = ""
    let todos;
    if(projectName === defaultProjectName){
         todos = defaultProjectTodos
    }else{
         todos = Projects[projectName].todos
    }


    for (let i in todos) {
        mainContentElement.appendChild(createTodoElement(todos[i]))
    }

    function createTodoElement(todo) {
        const todoElement = document.createElement("div")
        todoElement.classList.add("todo")
        todoElement.dataset.projectName = projectName
        todoElement.dataset.todoTitle = todo.title;
        const todoTitle = document.createElement("h1")
        todoTitle.classList.add("todoTitle")
        todoTitle.textContent = todo.title
        todoElement.appendChild(todoTitle)
        if (todo.description) {
            const todoDescription = document.createElement("p")
            todoDescription.classList.add("todoDescription")
            todoDescription.textContent = todo.description
            todoElement.appendChild(todoDescription)

        }

        if (todo.dueDate) {
            const todoDueDate = document.createElement("div")
            todoDueDate.classList.add("todoDueDate")
            todoDueDate.textContent = todo.dueDate;
            todoElement.appendChild(todoDueDate)
        }
        const todoPriority = document.createElement("div")
        todoPriority.classList.add("todoPriority")
        todoPriority.textContent = todo.priority
        const todoCompletion = document.createElement("input")
        todoCompletion.classList.add("todoCompletion")
        todoCompletion.type = "checkbox"
        if (todo.completed) {
            todoElement.classList.add("todoCompleted")
            todoCompletion.checked = true
        };
        todoElement.append(todoPriority, todoCompletion)
        return todoElement
    }
}
function createTodoButtonHandler() {
    const addTodoButton = document.querySelector("#createTodoButton")
    addTodoButton.addEventListener("click", (e) => {
        createTodoDialog.showModal()
    })
}

function createTodoDialogPopulator() {
    const projectsSelectMenu = createTodoDialog.querySelector("#projectsSelectMenu")
    projectsSelectMenu.textContent = ""
    Projects = viewAllProjects()

    for (let i in Projects) {
        const project = Projects[i]
        projectsSelectMenu.appendChild(addOption(project.name))
    }

    function addOption(value) {
        const option = document.createElement("option")
        option.value = value;
        option.textContent = value;
        return option
    }
    const dueDateInput = createTodoDialog.querySelector("p #dueDateOfTodo")
    dueDateInput.min = format(new Date(), 'yyyy-MM-dd')

    const closeButton = createTodoDialog.querySelector("button.closeButton")
    closeButton.addEventListener("click", () => {
        createTodoDialog.close()
    })
}

function createTodoDialogHandler() {
    const form = createTodoDialog.querySelector("form")
    form.addEventListener("submit", () => {
        event.preventDefault()
        const projectName = form.querySelector("p select#projectsSelectMenu").value
        const details = {
            title: form.querySelector("p input#titleOfTodo").value,
            description: form.querySelector("p textarea#descriptionOfTodo").value,
            dueDate: form.querySelector("p input#dueDateOfTodo").value,
            priority: form.querySelector("p select#prioritySelectMenu").value
        }
        createTodo(details, projectName)
        createTodoDialog.close()
        updateScreen()
    })
}

function createProjectButtonHandler() {
    const button = createProjectInput.querySelector("button")
    const input = createProjectInput.querySelector("input")

    button.addEventListener("click", () => {
        if (input.value) {
            createProject(input.value)
            input.value = ""
            Projects = viewAllProjects()
            createTodoDialogPopulator()
            updateScreen()
        }
    })

}
