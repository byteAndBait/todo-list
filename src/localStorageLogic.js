import { Todo, Project } from "./entities.js"
export function saveToLocal(Projects) {
    localStorage.setItem(localProjectsKeyword, JSON.stringify(Projects))
}

export function _clearLocal() {
    localStorage.clear(localProjectsKeyword)
}
export function getFromLocal() {
    if (localStorage.getItem(localProjectsKeyword) == undefined) {
        localStorage.setItem(localProjectsKeyword, JSON.stringify({}))
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
        return localProjects
    }
}
