import "../css/main.css"
import "../css/normalize.css"
import { clearLocal, createTodo, EditATodo, viewATodo, removeATodo, createProject, removeProject, viewAProject, viewAllProjects } from "../coreLogic/todoList.js"
import { format } from "date-fns"
const projectsList = document.querySelector("nav.sideBar .projectsList")
const mainContentElement = document.querySelector("main.content")
const createTodoDialog = document.querySelector("#createTodoDialog")
const createProjectInput = document.querySelector(".createProjectInput")
const defaultProjectName = "All Todos"
let Projects = viewAllProjects()

export function setupUI() {
    updateProjectsList()
    createTodoDialogPopulator()
    createTodoDialogHandler()
    createTodoButtonHandler()
    createProjectButtonHandler()
    projectsListEventsHandler()
    mainContentElementEventsHandler()
    updateMainContent()
}


function projectsListEventsHandler() {
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
            updateProjectsList()
        }
    })
}


function updateMainContent() {
    if (document.querySelector(".projectTile.active")) {
        document.querySelector(".projectTile.active .projectName").click();
        return
    }
    if (document.querySelector(`.projectTile[data-project-name='${defaultProjectName}'] .projectName`)) {

        document.querySelector(`.projectTile[data-project-name='${defaultProjectName}'] .projectName`).click()
        return
    }
    showContentOfAProject(defaultProjectName)
}




function mainContentElementEventsHandler() {
    mainContentElement.addEventListener("click", () => {
        const element = event.target
        const projectName = element.dataset.projectName;
        if (element.classList.contains("todoCompletion")) {
            const todo = viewATodo(projectName, element.dataset.todoId)
            if (element.checked) {
                EditATodo(projectName, todo.id, "completed", true)
                document.querySelector(`.todo[id='${todo.id}']`).classList.add("todoCompleted")
            } else if (element.checked === false) {
                EditATodo(projectName, todo.id, "completed", false)
                document.querySelector(`.todo[id='${todo.id}']`).classList.remove("todoCompleted")
            }
            return;
        }
        if (element.classList.contains("todoRemove")) {
            const todo = viewATodo(projectName, element.dataset.todoId)
            removeATodo(projectName, todo.id)
            updateMainContent()

        }
        if (element.classList.contains("todoEdit")) {
            const todo = viewATodo(projectName, element.dataset.todoId)
            editTodoDialog(projectName, todo)

        }
    })
}

function updateProjectsList() {
    Projects = viewAllProjects()
    projectsList.textContent = ''
    projectsList.appendChild(createProjectTile(defaultProjectName))

    const projectNames = [];

    for (let i in Projects) {
        const project = Projects[i]
        projectNames.push(project.name)
    }


    for (let i in projectNames) {
        const projectName = projectNames[i]
        if (!(projectName === "Uncategorized")) { // To Hide the Uncategorized projectTile
            const projectTileElement = createProjectTile(projectName)
            projectsList.appendChild(projectTileElement)
        }
    }





    function createProjectTile(projectName) {
        const projectTile = document.createElement("div")
        projectTile.classList.add("projectTile")
        projectTile.dataset.projectName = projectName

        const projectNameElement = document.createElement("div")
        projectNameElement.classList.add("projectName")
        projectNameElement.textContent = projectName
        projectTile.appendChild(projectNameElement)

        if (!(projectName === defaultProjectName)) { // No remove button on All Todos Project
            const removeButton = document.createElement("button")
            removeButton.textContent = "x"
            removeButton.classList.add("removeProjectButton")
            projectTile.appendChild(removeButton)
        }

        return projectTile
    }
    updateMainContent()

}


function showContentOfAProject(projectName) {
    Projects = viewAllProjects()
    mainContentElement.textContent = ""
    let todos;
    if (projectName === defaultProjectName) {
        for (let i in Projects) {
            const project = Projects[i];
            for (let j in project.todos) {
                mainContentElement.appendChild(createTodoElement(project.todos[j], project.name))
            }
        }
        return
    } else {
        todos = Projects[projectName].todos
    }


    for (let i in todos) {
        mainContentElement.appendChild(createTodoElement(todos[i], projectName))
    }

    function createTodoElement(todo, projectName) {
        const todoElement = document.createElement("div")
        todoElement.classList.add("todo")
        todoElement.id = todo.id;
        todoElement.dataset.projectName = projectName

        const todoMainTitle = document.createElement("div")
        todoMainTitle.classList.add("todoMainTitle")

        const todoTitle = document.createElement("h1")
        todoTitle.classList.add("todoTitle")
        todoTitle.textContent = todo.title


        const todoPriority = document.createElement("div")
        todoPriority.classList.add("todoPriority")
        todoPriority.textContent = todo.priority

        const todoCompletion = document.createElement("input")
        todoCompletion.classList.add("todoCompletion")
        todoCompletion.type = "checkbox"
        todoCompletion.dataset.todoId = todo.id
        todoCompletion.dataset.projectName = projectName

        if (todo.completed) {
            todoCompletion.checked = "checked"
            todoElement.classList.add("todoCompleted")
        }
        const todoDueDate = document.createElement("div")
        todoDueDate.classList.add("todoDueDate")
        todoDueDate.textContent = todo.dueDate
        todoMainTitle.append(todoCompletion, todoTitle, todoDueDate, todoPriority)

        // Expanded Details
        const details = document.createElement("div")
        details.classList.add("details")


        const todoDescription = document.createElement("p")
        todoDescription.classList.add("todoDescription")
        todoDescription.textContent = todo.description




        // Utilities
        const utilities = document.createElement("div")
        utilities.classList.add("utilities")
        const removeButton = document.createElement("button")
        removeButton.textContent = "remove"
        removeButton.classList.add("todoRemove")
        removeButton.dataset.todoId = todo.id
        removeButton.dataset.projectName = projectName

        const editButton = document.createElement("button")
        editButton.textContent = "edit"
        editButton.classList.add("todoEdit")
        editButton.dataset.todoId = todo.id
        editButton.dataset.projectName = projectName
        utilities.append(removeButton, editButton)

        details.append(todoDescription, utilities)
        todoElement.append(todoMainTitle, details)
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
    Projects = viewAllProjects()
    const projectsSelectMenu = createTodoDialog.querySelector("#projectsSelectMenu")
    projectsSelectMenu.textContent = ""

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
        updateMainContent()
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
            updateProjectsList()

        }
    })

}

function editTodoDialog(projectName, todo) {
    const dialog = document.getElementById("editTodoDialog")
    dialog.querySelector("#titleOfTodo").value = todo.title;
    dialog.querySelector("#dueDateOfTodo").value = todo.dueDate
    dialog.querySelector("#descriptionOfTodo").value = todo.description
    dialog.querySelector(`option[value='${todo.priority}']`).selected = "selected"
    dialog.showModal()
    const closeButton = dialog.querySelector("button.closeButton")
    closeButton.addEventListener("click", () => {
        dialog.close()
    })
    const dueDateInput = dialog.querySelector("p #dueDateOfTodo")
    dueDateInput.min = format(new Date(), 'yyyy-MM-dd')
    const form = dialog.querySelector("form")
    form.addEventListener("submit", () => {
        event.preventDefault()
        const modifiedDetails = {
            title: dialog.querySelector("#titleOfTodo").value,
            dueDate: dialog.querySelector("#dueDateOfTodo").value,
            description: dialog.querySelector("#descriptionOfTodo").value,
            priority: dialog.querySelector("p select#prioritySelectMenu").value
        }
        for (let dataName in modifiedDetails) {

            EditATodo(projectName, todo.id, dataName, modifiedDetails[dataName])

        }
        dialog.close()
        updateMainContent()

    })
}