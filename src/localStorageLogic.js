import { Todo, Project } from "./entities.js"
const localProjectsKeyword = "projects"
export function saveToLocal(projects) {
    localStorage.setItem(localProjectsKeyword,
        JSON.stringify(projects))
}
export function getFromLocal() {
    if (localStorage.getItem(localProjectsKeyword)) {
        let localProjects = JSON.parse(localStorage.getItem(localProjectsKeyword))
        localProjects = localProjects.map((project) => {
            project.todos = project.todos.map((todo) => {
                return Object.setPrototypeOf(todo, Object.getPrototypeOf(new Todo(todo)))
            })
            return Object.setPrototypeOf(project, Object.getPrototypeOf(new Project(project.name)))

        })
        return localProjects
    }
    return undefined
}

export function clearLocal() {
    localStorage.clear(localProjectsKeyword)
}