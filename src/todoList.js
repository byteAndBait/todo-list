import { Todo, Project } from "./entities.js"
import { parseISO } from "date-fns"
import { getFromLocal, saveToLocal, clearLocal } from "./localStorageLogic.js"
export const todoList = {
    Projects: [],
    loadProjectsFromLocal: function () {
        this.Projects = getFromLocal()
    },
    saveProjectsToLocal: function () { saveToLocal(this.Projects) },
    init: function () {
        if (getFromLocal() == undefined) {
            this.Projects = []
            this.saveProjectsToLocal()
        }
        this.loadProjectsFromLocal()
        if (this.Projects.find((project) => project.name == "default") === undefined) {
            this.createProject("default")
            this.saveProjectsToLocal()
        }
    },
    createProject(name) {
        this.loadProjectsFromLocal()
        if (this.Projects.find((project) => project.name == name)) {
            console.log(this.Projects)
            console.log(name)
            throw new Error("Project Already Exists")
        }
        this.Projects.push(new Project(name))
        this.saveProjectsToLocal()
    },
    removeProject(name) {
        this.loadProjectsFromLocal()
        this.Projects.filter((project) => { project.name === name })
        this.saveProjectsToLocal()
    },
    getProject(name) {
        this.loadProjectsFromLocal()
        if (!(this.Projects.find((project) => project.name === name))) {
            console.log(this.Projects)
            console.log(name)
            console.log((this.Projects.find((project) => project.name === name)))
            throw new Error("Project is not found")
        }
        return this.Projects.find((project) => project.name === name)
    },
    getTodo(projectName, id) {
        loadFromLocal()
        if (!(this.Projects.find((project) => project.name === projectName))) {
            console.log(this.Projects)
            console.log(name)
            throw new Error("Project is not found")
        }
        let project = this.Projects.find((project) => project.name === projectName)
        if (!(project.todos.find((todo) => todo.id === id))) {
            console.log(project)
            console.log(id)
            throw new Error("Todo is not found")
        }
        return project.todos.find((todo) => todo.id === id)
    },
    clearLocal
}

// const projectToBeCreated = new Project("Uncategorized")
// Projects["Uncategorized"] = Object.assign(
//     projectToBeCreated,
//     projectAddTodo(projectToBeCreated),
//     projectRemoveTodo(projectToBeCreated)
// )
// export { clearLocal, createTodo, createProject, EditATodo, viewATodo, removeATodo, viewAProject, viewAllProjects, removeProject }