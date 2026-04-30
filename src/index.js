import { setupUI } from "./UI/ui.js"
import { clearLocal, createTodo, EditATodo, viewATodo, removeATodo, createProject, removeProject, viewAProject, viewAllProjects } from "./coreLogic/todoList.js"

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

const dumbData = () => {
    createTodo(myTodoDetails)
    createProject("Studying")
    createTodo(myOtherTodoDetails, "Studying")

    EditATodo("default", myTodoDetails.title, "description", "It's actually pretty challenging")

}
    EditATodo("default", myTodoDetails.title, "description", "It's actually not pretty challenging")

