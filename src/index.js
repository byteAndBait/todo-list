import "./css/main.css"
import "./css/normalize.css"
import { todoEdit, projectAddTodo, projectRemoveTodo } from "./compositors.js"
const TODOLIST = (() => {
    let Projects = {}

    const saveToLocal = () => {
        localStorage.setItem("projects", JSON.stringify(Projects))
    }
    const clearLocal = () => {
        localStorage.clear("projects")
        syncLocal()
    }
    const syncLocal = () => {
        if (!localStorage.getItem("projects")) {
            return "Nothing is saved in LocalStorage"
        }
        let localProjects = JSON.parse(localStorage.getItem("projects"))
        for (let project in localProjects) {
            project = localProjects[project]
            project = Object.assign(
                project,
                projectAddTodo(project),
                projectRemoveTodo(project)
            )
            for (let todo in project.todos) {
                todo = project.todos[todo]
                todo = Object.assign(
                    todo,
                    todoEdit(todo)
                )
            }
        }
        // Merge current Projects with localStorage
        Projects = Object.assign(Projects, localProjects)
    }
    class Todo {
        constructor(details) {
            this.title = details.title
            this.description = details.description
            this.priority = details.priority || "Low"
        }
    }
    class Project {
        constructor(name) {
            this.name = name
            this.todos = {}
        }
    }
    const createProject = (name) => {
        if (Projects[name]) {
            return "Project Already Exists!"
        } else {
            const projectToBeCreated = new Project(name)
            Projects[name] = Object.assign(
                projectToBeCreated,
                projectAddTodo(projectToBeCreated),
                projectRemoveTodo(projectToBeCreated)
            )
        }
    }

    createProject("default")


    // functions That modify the Projects object

    const createTodo = (details, projectName) => {
        syncLocal()
        if (!projectName) projectName = "default";
        const todoToBeCreated = new Todo(details)
        Projects[projectName].addTodo(Object.assign(todoToBeCreated, todoEdit(todoToBeCreated)))
        saveToLocal()
    }

    const EditATodo = (projectName, todoTitle, dataName, modification) => {
        syncLocal()
        if (!projectName || !todoTitle || !dataName || !modification) {
            return "Please Re-Check Your arguments"
        }
        const currentTodo = _getATodo(projectName, todoTitle)

        currentTodo.edit(dataName, modification)
        saveToLocal()
    }

    const removeATodo = (projectName, todoTitle) => {
        syncLocal()
        Projects[projectName].removeTodo(todoTitle)
        saveToLocal()
    }


    // Internal use only functions
    const _getATodo = (projectName, todoTitle) => {
        syncLocal()
        try {
            Projects[projectName].todos[todoTitle]
        } catch (error) {
            return
        }
        const todoToGet = Projects[projectName].todos[todoTitle]
        return todoToGet
    }


    // View Data Function (Doesn't affect the Projects object)
    const viewATodo = (projectName, todoTitle) => {
        syncLocal()
        if (_getATodo(projectName, todoTitle)) {
            return JSON.parse(JSON.stringify(Object.assign({}, _getATodo(projectName, todoTitle))))
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
    return { createTodo, createProject, EditATodo, viewATodo, removeATodo, viewAProject, viewAllProjects, syncLocal, saveToLocal, clearLocal }
})()

const myTodoDetails = {
    title: "Programming",
    description: "Most wonderful thing ever",
    priority: "Medium"
}
const myOtherTodoDetails = {
    title: "Math Lecture",
    description: "Pretty Fascinating",
    priority: "High"
}
const dumbData = () => {
    TODOLIST.createTodo(myTodoDetails)
    TODOLIST.createProject("Studying")
    TODOLIST.createTodo(myOtherTodoDetails, "Studying")

    TODOLIST.EditATodo("default", myTodoDetails.title, "description", "It's actually pretty challenging")
    console.log(TODOLIST.viewATodo("default", myTodoDetails.title))
    console.log(TODOLIST.viewATodo("Studying", myOtherTodoDetails.title))

    TODOLIST.removeATodo("Studying", myOtherTodoDetails.title)
    console.log(TODOLIST.viewATodo("Studying", myOtherTodoDetails.title))
}
TODOLIST.clearLocal()
dumbData()