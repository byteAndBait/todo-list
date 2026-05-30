import { Todo, Project } from "./entities.js"
// import { getFromLocal, saveToLocal, _clearLocal } from "./localStorageLogic.js"

// import { isMatch } from "date-fns";
export const todoList = {


    // syncLocal: () => {
    //     Projects = getFromLocal(Projects)
    // },
    // clearLocal: () => {
    //     _clearLocal()
    //     syncLocal()
    // },
    Projects: [],

    // functions That modify the Projects object

    createProject(name) {
        if (this.Projects.find((project) => { project.name === name })) {
            console.log(this.Projects)
            console.log(name)
            throw new Error("Project Already Exists")
        }
        this.Projects.push(new Project(name))
    },
    removeProject(name) {
        this.Projects.filter((project) => { project.name === name })
    },

    getProject(name) {
        if (!(this.Projects.find((project) => project.name === name))) {
            console.log(this.Projects)
            console.log(name)
            console.log((this.Projects.find((project) => project.name === name)))
            throw new Error("Project is not found")
        }
        return this.Projects.find((project) => project.name === name)
    },

    getTodo(projectName, id) {
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
}

// const projectToBeCreated = new Project("Uncategorized")
// Projects["Uncategorized"] = Object.assign(
//     projectToBeCreated,
//     projectAddTodo(projectToBeCreated),
//     projectRemoveTodo(projectToBeCreated)
// )
// saveToLocal(Projects)
// export { clearLocal, createTodo, createProject, EditATodo, viewATodo, removeATodo, viewAProject, viewAllProjects, removeProject }