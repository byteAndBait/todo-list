import { todoList } from "./todoList.js"
export class Todo {
    constructor(details) {
        this.id = crypto.randomUUID()
        this.title = details.title
        this.description = details.description
        this.priority = details.priority
        this.completed = details.completed || false
        this.dueDate = details.dueDate
    }
    toggleComplete() {
        this.completed = this.completed ? false : true;
        todoList.saveProjectsToLocal()
    }
    editData(details) {
        this.title = details.title || this.title
        this.description = details.description
        this.priority = details.priority || this.priority
        this.completed = details.completed || this.completed
        this.dueDate = details.dueDate || this.dueDate
        todoList.saveProjectsToLocal()
    }
}
export class Project {
    constructor(name) {
        this.name = name
        this.todos = []
    }
    addTodo(details) {
        let todo = new Todo(details)
        this.todos.push(todo)
        todoList.saveProjectsToLocal()
        return todo
    }
    removeTodo(id) {
        this.todos = this.todos.filter((todo) => todo.id != id)
        todoList.saveProjectsToLocal()
    }
}
