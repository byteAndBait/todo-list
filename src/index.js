import "./css/main.css"
import "./css/normalize.css"
import { clearLocal, createTodo, EditATodo, viewATodo, removeATodo, createProject, removeProject, viewAProject, viewAllProjects } from "./todoList.js"

const myTodoDetails = {
    title: "Programming",
    description: "Most wonderful thing ever",
    priority: "Medium",
    dueDate: new Date(2027, 4, 30)
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
}