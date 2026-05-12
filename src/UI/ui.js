import "../css/main.css"
import "../css/normalize.css"
import { createTodo, EditATodo, viewATodo, removeATodo, createProject, removeProject, viewAllProjects } from "../coreLogic/todoList.js"
import { format, formatDistanceToNow } from "date-fns"
const projectsList = document.querySelector("nav.sideBar .projectsList")
const mainContentElement = document.querySelector("main.content")
const createTodoDialogElement = document.querySelector("#createTodoDialog")
const editTodoDialogElement = document.querySelector("#editTodoDialog")
const createProjectInput = document.querySelector(".createProjectInput")
const defaultProjectName = "All Todos"
let Projects = viewAllProjects()

export function setupUI() {
    updateProjectsList()
    createTodoDialogPopulator()
    createTodoDialogEventsHandler()
    editTodoDialogEventsHandler()
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
}




function mainContentElementEventsHandler() {
    mainContentElement.addEventListener("click", (e) => {
        const element = e.target
        const projectName = element.closest(".todo").dataset.projectName;
        console.log(projectName)

        if (element.classList.contains("todoCompletion")) {
            const todo = viewATodo(projectName, element.closest(".todo").id)
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
            const todo = viewATodo(projectName, element.closest(".todo").id)
            removeATodo(projectName, todo.id)
            updateMainContent()

        }
        if (element.classList.contains("todoEdit")) {
            console.log(`From Events
projectName: ${projectName}
ID: ${element.closest(".todo").id}`)
            const todo = viewATodo(projectName, element.closest(".todo").id)
            console.log(todo)
            editTodoDialogPopulator(projectName, todo)
            editTodoDialogElement.showModal()
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

        if (todo.completed) {
            todoCompletion.checked = "checked"
            todoElement.classList.add("todoCompleted")
        }
        const todoDueDate = document.createElement("div")
        todoDueDate.classList.add("todoDueDate")
        try {
            todoDueDate.textContent = formatDistanceToNow(todo.dueDate)
        } catch (error) {
            todoDueDate.textContent = ""
        }
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
        removeButton.className = "fa-solid fa-trash"
        removeButton.classList.add("todoRemove")

        const editButton = document.createElement("button")
        editButton.className = "fa-solid fa-pen-to-square"
        editButton.classList.add("todoEdit")
        utilities.append(removeButton, editButton)

        details.append(todoDescription, utilities)
        todoElement.append(todoMainTitle, details)
        return todoElement
    }
}

// Todo Creation

function createTodoDialogPopulator() {
    Projects = viewAllProjects()
    const projectsSelectMenu = createTodoDialogElement.querySelector("#projectsSelectMenu")
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
    const dueDateInput = createTodoDialogElement.querySelector("p #dueDateOfTodo")
    dueDateInput.min = format(new Date(), 'yyyy-MM-dd')

}

function createTodoDialogEventsHandler() {
    const form = createTodoDialogElement.querySelector("form")
    const closeButton = createTodoDialogElement.querySelector("button")
    const createTodoButton = document.getElementById("createTodoButton")
    createTodoButton.addEventListener("click", () => {
        createTodoDialogElement.showModal("")
    })
    closeButton.addEventListener("click", () => {
        createTodoDialogElement.close()
    })
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
        createTodoDialogElement.close()
        updateMainContent()
    })
}



// Project Creation
function createProjectButtonHandler() {
    const button = createProjectInput.querySelector("button")
    const input = createProjectInput.querySelector("input")

    button.addEventListener("click", () => {
        if (input.value) {
            try {
                createProject(input.value)
                input.value = ""
                Projects = viewAllProjects()
                createTodoDialogPopulator()
                updateProjectsList()
            } catch (error) {
                console.log("Project Already Exists")
                input.value = ""
            }

        }
    })

}

// Editing A todo
function editTodoDialogEventsHandler() {

    const form = editTodoDialogElement.querySelector("form")

    form.addEventListener("submit", () => {
        event.preventDefault()
        const modifiedDetails = {
            title: editTodoDialogElement.querySelector("#titleOfTodo").value,
            dueDate: editTodoDialogElement.querySelector("#dueDateOfTodo").value,
            description: editTodoDialogElement.querySelector("#descriptionOfTodo").value,
            priority: editTodoDialogElement.querySelector("p select#prioritySelectMenu").value
        }
        for (let dataName in modifiedDetails) {
            EditATodo(editTodoDialogElement.dataset.projectName, editTodoDialogElement.dataset.todoToBeEditedId, dataName, modifiedDetails[dataName])
        }
        editTodoDialogElement.close()
        updateMainContent()

    })
    const closeButton = editTodoDialogElement.querySelector("button.closeButton")
    closeButton.addEventListener("click", () => {
        editTodoDialogElement.close()
    })
}

function editTodoDialogPopulator(projectName, todo) {
    editTodoDialogElement.querySelector("#titleOfTodo").value = todo.title;
    editTodoDialogElement.querySelector("#dueDateOfTodo").value = todo.dueDate
    editTodoDialogElement.querySelector("#descriptionOfTodo").value = todo.description
    editTodoDialogElement.querySelector(`option[value='${todo.priority}']`).selected = "selected"
    editTodoDialogElement.dataset.projectName = projectName
    editTodoDialogElement.dataset.todoToBeEditedId = todo.id
    const dueDateInput = editTodoDialogElement.querySelector("p #dueDateOfTodo")
    dueDateInput.min = format(new Date(), 'yyyy-MM-dd')
    dueDateInput.value = viewATodo(projectName, todo.id).dueDate
}