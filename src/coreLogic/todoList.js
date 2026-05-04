import { todoEdit, projectAddTodo, projectRemoveTodo } from "./compositors.js"
import { getFromLocal, saveToLocal, _clearLocal } from "./localStorageLogic.js"

const syncLocal = () => {
    Projects = getFromLocal(Projects)
}
const clearLocal = () => {
    _clearLocal()
    syncLocal()
}
export let Projects = {}


class Todo {
    constructor(details) {
        this.title = details.title
        this.description = details.description
        this.priority = details.priority
        this.completed = details.completed || false
        this.dueDate = details.dueDate
    }
}
class Project {
    constructor(name) {
        this.name = name
        this.todos = {}
    }
}


// functions That modify the Projects object

const createProject = (name) => {
    syncLocal()
    if (Object.hasOwn(Projects, name)) {
        return "Project Already Exists!"
    }
    const projectToBeCreated = new Project(name)
    Projects[name] = Object.assign(
        projectToBeCreated,
        projectAddTodo(projectToBeCreated),
        projectRemoveTodo(projectToBeCreated)
    )
    saveToLocal(Projects)
}
const removeProject = (name) => {
    syncLocal()
    delete Projects[name]
    saveToLocal(Projects)
}




const createTodo = (details, projectName) => {
    syncLocal()
    if (Projects[projectName] == undefined) {
        return "Your Project Doesn't exist"
    }
    if (Projects[projectName].todos[details.title]) {
        return "Your Todo Does Exist!"
    }
    const todoToBeCreated = new Todo(details)
    Projects[projectName].addTodo(
        Object.assign(todoToBeCreated, todoEdit(todoToBeCreated)
        ))
    saveToLocal(Projects)
}

const EditATodo = (projectName, todoTitle, dataName, modification) => {
    syncLocal()
    if (_getATodo(projectName, todoTitle) == undefined) {
        throw new Error("Your Todo Doesn't Exist!")
    }

    const currentTodo = _getATodo(projectName, todoTitle)
    currentTodo.edit(dataName, modification)
    saveToLocal(Projects)
}

const removeATodo = (projectName, todoTitle) => {
    syncLocal()
    Projects[projectName].removeTodo(todoTitle)
    saveToLocal(Projects)
}


// Internal use only functions
const _getATodo = (projectName, todoTitle) => {
    syncLocal()
    try {
        Projects[projectName].todos[todoTitle]
    } catch (error) {
        return undefined;
    }
    const todoToGet = Projects[projectName].todos[todoTitle]
    return todoToGet
}


// View Data Function (Doesn't affect the Projects object)
const viewATodo = (projectName, todoTitle) => {
    syncLocal()
    if (_getATodo(projectName, todoTitle)) {
        return JSON.parse(JSON.stringify(_getATodo(projectName, todoTitle)))
    }
    return "Your Todo Doesn't Exist!"
}

const viewAProject = (projectName) => {
    syncLocal()
    if (Projects[projectName]) {
        return JSON.parse(
            JSON.stringify(
                Object.assign({}, Projects[projectName])
            )
        )
    }
    return "Your Project Doesn't Exist!"
}
const viewAllProjects = () => {
    syncLocal()
    return JSON.parse(
        JSON.stringify(
            Object.assign({}, Projects)
        )
    )
}


export { clearLocal, createTodo, createProject, EditATodo, viewATodo, removeATodo, viewAProject, viewAllProjects, removeProject }