import "./css/main.css"
import "./css/normalize.css"
import { createTodo, createProject, EditATodo, viewATodo, removeATodo, viewAProject, viewAllProjects, removeProject } from "./todoList.js"
import { clearLocal } from "./localStorageLogic.js"
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
    createTodo(myTodoDetails)
    createProject("Studying")
    createTodo(myOtherTodoDetails, "Studying")

    EditATodo("default", myTodoDetails.title, "description", "It's actually pretty challenging")
    console.log(viewATodo("default", myTodoDetails.title))
    console.log(viewATodo("Studying", myOtherTodoDetails.title))

    removeATodo("Studying", myOtherTodoDetails.title)
    console.log(viewATodo("Studying", myOtherTodoDetails.title))
}
