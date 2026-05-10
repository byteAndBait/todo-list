import { todoEdit, projectAddTodo, projectRemoveTodo } from "./compositors.js"
import { getFromLocal, saveToLocal, _clearLocal } from "./localStorageLogic.js"
import { isMatch } from "date-fns";

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
        if (details.dueDate === "") {
            this.dueDate = ""
        } else {
            if (!isMatch(details.dueDate, 'yyyy-MM-dd')) {
                throw new Error("Not a valid date")
            }
            this.dueDate = details.dueDate
        }
        this.id = crypto.randomUUID()
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
    const todoToBeCreated = new Todo(details)
    Projects[projectName].addTodo(
        Object.assign(todoToBeCreated, todoEdit(todoToBeCreated)
        ))
    saveToLocal(Projects)
}

const EditATodo = (projectName, id, dataName, modification) => {
    syncLocal()
    
    const currentTodo = _getATodo(projectName, id)
console.log(`From EditATodo:
id: ${id}
projectName: ${projectName}
dataName: ${dataName}`)
    currentTodo.edit(dataName, modification)
    saveToLocal(Projects)
}

const removeATodo = (projectName, id) => {
    syncLocal()
    Projects[projectName].removeTodo(id)
    saveToLocal(Projects)
}


// Internal use only functions
const _getATodo = (projectName, id) => {
    syncLocal()
    try {
        if (Projects[projectName].todos[id] != undefined) {
            const todoToGet = Projects[projectName].todos[id]
            return todoToGet
        }
    } catch (error) {
        throw new Error("Your Todo Doesn't Exist!")
    }


}


// View Data Function (Doesn't affect the Projects object)
const viewATodo = (projectName, id) => {
    syncLocal()
    if (_getATodo(projectName, id)) {
        return JSON.parse(JSON.stringify(_getATodo(projectName, id)))
    }
    throw new Error("Your Todo Doesn't Exist!")
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