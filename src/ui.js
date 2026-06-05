import { todoList } from "./todoList.js"
import { parseISO, formatDistanceToNow, format } from "date-fns"
const projectsList = document.querySelector("nav.sideBar .projectsList")
const mainContentElement = document.querySelector("main.content")
const todoDialog = document.querySelector("#createTodoDialog")
const createProjectInput = document.querySelector(".createProjectInput")
const allTodosProjectName = "All Todos"
let todoEditable = false;
let todoEditableID;
let todoEditableProjectName;
export function setupUI() {
    updateProjectsList()
    todoDialogInit()
    todoDialogEventsHandler()
    createProjectButtonHandler()
    projectsListEventsHandler()
    mainContentElementEventsHandler()
    updateSpecialTiles()
}
function projectsListEventsHandler() {
    projectsList.addEventListener("click", (e) => {
        let element = e.target
        if (element.classList.contains("createProjectButton")) {
            let input = document.getElementById("projectName")
            input.setCustomValidity("")
            if (input.value.length === 0) {
                input.setCustomValidity("Project name can't be empty")
                return
            }

            todoList.createProject(input.value)
            return
        }
        if (element.classList.contains("projectName")) {
            try {
                projectsList.querySelector(".projectTile.active").classList.remove("active")
            } catch (e) { }
            renderProjectTodos(element.closest(".projectTile").dataset.projectName)
            element.closest(".projectTile").classList.add("active")
            return
        }
        if(element.classList.contains("removeProjectButton")){
            todoList.removeProject(element.closest(".projectTile").dataset.projectName)

            updateProjectsList()
            updateSpecialTiles()
            return
        }
    })
}


function updateSpecialTiles() {
    if (document.querySelector(".projectTile.active")) {
        document.querySelector(".projectTile.active .projectName").click();
        return
    }
    if (document.querySelector(`.projectTile[data-project-name='${allTodosProjectName}'] .projectName`)) {
        document.querySelector(`.projectTile[data-project-name='${allTodosProjectName}'] .projectName`).click()
        return
    }
}


function mainContentElementEventsHandler() {
    mainContentElement.addEventListener("click", (e) => {
        const element = e.target
        let projectName;
        let todo;
        try {
            projectName = element.closest(".todo").dataset.projectName;
            todo = todoList.getTodo(projectName, element.closest(".todo").id)
        } catch (error) {
            return;
        }
        if (element.classList.contains("todoCompletion")) {
            todo.toggleComplete()
            if(todo.completed){
                document.querySelector(`.todo[id='${todo.id}']`).classList.add("todoCompleted")
                return
            }
            if(!todo.completed){
                document.querySelector(`.todo[id='${todo.id}']`).classList.remove("todoCompleted")
                return
            }
            return;
        }
        if (element.classList.contains("todoRemove")) {
            try {
                todoList.getProject(projectName).removeTodo(todo.id)
            } catch (e) {
                return
            }
            updateSpecialTiles()
        }
        if (element.classList.contains("todoEdit")) {
            todoEditable = true
            todoEditableID = todo.id
            todoEditableProjectName = projectName
            editTodoDialogPopulator(projectName, todo)
            todoDialog.showModal()
        }
    })
}

function updateProjectsList() {
    projectsList.textContent = ''
    projectsList.appendChild(createProjectTile(allTodosProjectName))
    const projectNames = [];

    todoList.Projects.map((project) => {
        projectNames.push(project.name)
    })

    projectNames.map((projectName) => {
        if (!(projectName === "Uncategorized")) { // To Hide the Uncategorized projectTile
            const projectTileElement = createProjectTile(projectName)
            projectsList.appendChild(projectTileElement)
        }
    })

    function createProjectTile(projectName) {
        const projectTile = document.createElement("div")
        projectTile.classList.add("projectTile")
        projectTile.dataset.projectName = projectName

        const projectNameElement = document.createElement("div")
        projectNameElement.classList.add("projectName")
        projectNameElement.textContent = projectName
        projectTile.appendChild(projectNameElement)

        if (!(projectName === allTodosProjectName)) { // No remove button on All Todos Project
            const removeButton = document.createElement("button")
            removeButton.textContent = "x"
            removeButton.classList.add("removeProjectButton")
            projectTile.appendChild(removeButton)
        }
        return projectTile
    }
    updateSpecialTiles()

}


function renderProjectTodos(projectName) {
    mainContentElement.textContent = ""
    if(projectName === allTodosProjectName){
        todoList.Projects.map((project) => {
            project.todos.map((todo) => {
                mainContentElement.appendChild(createTodoElement(todo, project.name))
            })
        })
        return
    }
    
    let todos;
    todos = todoList.getProject(projectName).todos
    todos.map((todo) => {
        mainContentElement.appendChild(createTodoElement(todo, projectName))
    })

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
            todoDueDate.textContent = formatDistanceToNow(parseISO(todo.dueDate))
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

function todoDialogInit() {
    const projectsSelectMenu = todoDialog.querySelector("#projectsSelectMenu")
    projectsSelectMenu.textContent = ""

    todoList.Projects.map((project) => {
        projectsSelectMenu.append(addOption(project.name))
    })
    function addOption(value) {
        const option = document.createElement("option")
        option.value = value;
        option.textContent = value;
        return option
    }
    const dueDateInput = todoDialog.querySelector("div #dueDateOfTodo")
    dueDateInput.min = format(new Date(), 'yyyy-MM-dd')
    return

}

function todoDialogEventsHandler() {
    const form = todoDialog.querySelector("form")
    const closeButton = todoDialog.querySelector("button.closeButton")
    closeButton.addEventListener("click", () => {
        console.log("bruh we are closing")
        todoDialog.close()
    })

    const createTodoButton = document.getElementById("createTodoButton")
    createTodoButton.addEventListener("click", () => {
        todoDialog.showModal("")
        
    todoDialog.querySelector("#projectsSelectMenu").closest("div").classList.remove("hidden")
    todoDialog.querySelector("input[type='submit']").value = "Create Your Todo"
    todoEditable = false;
    })


    form.addEventListener("submit", () => {
        event.preventDefault()
        console.log(event.target)
        if (!todoEditable) {
            const projectName = form.querySelector("select#projectsSelectMenu").value
            const details = {
                title: form.querySelector("input#titleOfTodo").value,
                description: form.querySelector("textarea#descriptionOfTodo").value,
                dueDate: form.querySelector("input#dueDateOfTodo").value,
                priority: form.querySelector("select#prioritySelectMenu").value
            }
            todoList.getProject(projectName).addTodo(details)
            todoDialog.close()
            updateSpecialTiles()
            return
        }

        if (todoEditable) {

            const modifiedDetails = {
                title: todoDialog.querySelector("#titleOfTodo").value,
                dueDate: todoDialog.querySelector("#dueDateOfTodo").value,
                description: todoDialog.querySelector("#descriptionOfTodo").value,
                priority: todoDialog.querySelector("select#prioritySelectMenu").value
            }
            todoList.getTodo(todoEditableProjectName, todoEditableID).editData(modifiedDetails)
            todoDialog.close()
            updateSpecialTiles()

            
            todoEditable = false;
            return
        }
    })
}



// Project Creation
function createProjectButtonHandler() {
    const button = createProjectInput.querySelector("button")
    const input = createProjectInput.querySelector("input")

    button.addEventListener("click", () => {
        if (input.value) {
            try {
                todoList.createProject(input.value)
                input.value = ""
                todoDialogInit()
                updateProjectsList()
            } catch (error) {
                console.log("Project Already Exists")
                input.value = ""
            }

        }
    })
}



function editTodoDialogPopulator(projectName, todo) {
    todoDialog.querySelector("#titleOfTodo").value = todo.title;
    todoDialog.querySelector("#dueDateOfTodo").value = todo.dueDate
    todoDialog.querySelector("#descriptionOfTodo").value = todo.description
    todoDialog.querySelector(`option[value='${todo.priority}']`).selected = "selected"
    todoDialog.dataset.projectName = projectName
    todoDialog.dataset.todoToBeEditedId = todo.id
    const dueDateInput = todoDialog.querySelector("#dueDateOfTodo")
    dueDateInput.min = format(new Date(), 'yyyy-MM-dd')
    dueDateInput.value = todo.dueDate
    todoDialog.querySelector("#projectsSelectMenu").closest("div").classList.add("hidden")
    todoDialog.querySelector("input[type='submit']").value = "Complete Editing"
}
