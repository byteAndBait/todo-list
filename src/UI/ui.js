import "../css/main.css"
import "../css/normalize.css"
import { clearLocal, createTodo, EditATodo, viewATodo, removeATodo, createProject, removeProject, viewAProject, viewAllProjects } from "../coreLogic/todoList.js"
import { format } from "date-fns"
const projectsList = document.querySelector("nav.sideBar .projectsList")
const mainContentElement = document.querySelector("main.content")
const createTodoDialog = document.querySelector("#createTodoDialog")

let Projects = viewAllProjects()

function updateProjectsList() {
    projectsList.textContent = ''
    const projectNames = [];
    Projects = viewAllProjects()
    for (let i in Projects) {
        const project = Projects[i]
        projectNames.push(project.name)
    }

    for (let i in projectNames) {
        const projectName = projectNames[i]
        projectsList.appendChild(createProjectButton(projectName))
    }




    function createProjectButton(projectName) {
        const projectButton = document.createElement("button")
        projectButton.classList.add("projectButton")
        projectButton.dataset.projectName = projectName
        projectButton.textContent = projectName
        return projectButton
    }
}
export function setupUI() {
    updateScreen()
    document.querySelector(".projectButton").click() // Show Default Project Content
    createTodoDialogPopulator()
    createTodoDialogHandler()

    createTodoButtonHandler()

}
function updateScreen() {
    updateProjectsList()
    projectsList.addEventListener("click", (e) => {
        if (e.target.classList.contains("projectButton")) {
            showContentOfAProject(e.target.dataset.projectName)

            projectsList.childNodes.forEach((child) => {
                child.classList.remove("active")
            })
            e.target.classList.toggle("active")
        }
    })
}
function showContentOfAProject(projectName) {
    mainContentElement.textContent = ""
    const todos = Projects[projectName].todos


    for (let i in todos) {
        mainContentElement.appendChild(createTodoElement(todos[i]))
    }

    function createTodoElement(todo) {
        const todoElement = document.createElement("div")
        todoElement.classList.add("todo")

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
        const todoCompletion = document.createElement("span")
        todoCompletion.classList.add("todoCompletion")
        todoCompletion.textContent = todo.completed
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
