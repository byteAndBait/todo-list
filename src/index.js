import "./css/main.css"
import "./css/normalize.css"

import { parseISO } from "date-fns"
// import { setupUI } from "./ui.js"z
// import { clearLocal, createTodo, EditATodo, viewATodo, removeATodo, createProject, removeProject, viewAProject, viewAllProjects } from "./todoList.js"
import { todoList } from "./todoList.js"
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

function dumbData() {
    todoList.createProject("default")
    let todo = todoList.getProject("default").addTodo(myTodoDetails)
    todo.editData(myOtherTodoDetails)
    console.log(todo)
}


dumbData()

// TODO : Refactor LocalStorage