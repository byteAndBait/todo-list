import { Projects } from "./todoList.js"
import { todoEdit, projectAddTodo, projectRemoveTodo } from "./compositors.js"

export const saveToLocal = () => {
    localStorage.setItem("projects", JSON.stringify(Projects))
}

export const clearLocal = () => {
    localStorage.clear("projects")
}
export const getFromLocal = () => {
    let ready = false;
    if (localStorage.getItem("projects") == undefined) {
        saveToLocal()
        return JSON.parse(localStorage.getItem("projects"))
    } else {
        let localProjects = JSON.parse(localStorage.getItem("projects"))
        // Bring Back methods to the objects after parsing JSON
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
        return Object.assign(Projects, localProjects)
    }
}