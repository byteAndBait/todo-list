import "./css/main.css"
import "./css/normalize.css"

import { todoList } from "./todoList.js"
import { Project } from "./entities.js"
const myTodoDetails = {
    title: "Programming",
    description: "Most wonderful thing ever",
    priority: "Medium",
    dueDate: new Date(2027, 4, 30)
}
const myOtherTodoDetails = {
    title: "Math Lecture",
    description: "Pretty Fascinating",
    priority: "High",
    dueDate: new Date(2022, 4, 30),
    completed: true
}

todoList.init()

// TODO : Refactor LocalStorage
