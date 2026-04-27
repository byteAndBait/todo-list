import "./css/main.css"
import "./css/normalize.css"
import { todoEdit,projectAddTodo,projectRemoveTodo } from "./compositors.js"
const TODOLIST = (() => {
    class Todo {
        constructor(details) {
            this.title = details.title
            this.description = details.description
            this.priority = details.priority || "Low"
        }
    }
    class Project{
        constructor(name){
            this.name = name
            this.todos = {}
        }
    }
    const Projects = {}
    const createProject = (name)=>{
        if(Projects[name]){
            return "Project Already Exists!"
        }else{
            const projectToBeCreated = new Project(name)
            Projects[name] = Object.assign(
                projectToBeCreated,
                projectAddTodo(projectToBeCreated),
                projectRemoveTodo(projectToBeCreated)
            )
        }
    }

    createProject("default")

    const createTodo = (details,projectName) => {
        if(!projectName) projectName = "default";
        const todoToBeCreated = new Todo(details)
        Projects[projectName].addTodo(Object.assign(todoToBeCreated,todoEdit(todoToBeCreated)))
    }

    const EditATodo = (projectName,todoTitle,dataName,modification)=>{
        if(!projectName || !todoTitle || !dataName || !modification){
            return "Please Re-Check Your arguments"
        }
        const currentTodo = _getATodo(projectName,todoTitle)
        
        currentTodo.edit(dataName,modification)
    }

    const _getATodo = (projectName,todoTitle)=>{
        try{
           Projects[projectName].todos[todoTitle] 
        }catch(error){
            return
        }
        const todoToGet = Projects[projectName].todos[todoTitle]
        return todoToGet
    }
    const viewATodo = (projectName,todoTitle)=>{
        if(_getATodo(projectName,todoTitle)){
            return JSON.parse(JSON.stringify(Object.assign({},_getATodo(projectName,todoTitle))))
        }
        return "Your Todo Doesn't Exist!"
        
    }
    const removeATodo = (projectName,todoTitle)=>{
        Projects[projectName].removeTodo(todoTitle)
    }

    const viewAProject = (projectName)=>{
        if(Projects[projectName]){
            return JSON.parse(
                JSON.stringify(
                    Object.assign({},Projects[projectName])
                )
            )
        }
        return "Your Project Doesn't Exist!"
    }
    const viewAllProjects = ()=>{
        return JSON.parse(
            JSON.stringify(
                Object.assign({},Projects)
            )
        )
    }
    return {createTodo,createProject,EditATodo,viewATodo,removeATodo,viewAProject,viewAllProjects}
})()

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
TODOLIST.createTodo(myTodoDetails)
TODOLIST.createProject("Studying")
TODOLIST.createTodo(myOtherTodoDetails,"Studying")

TODOLIST.EditATodo("default",myTodoDetails.title,"description","It's actually pretty challenging")
console.log(TODOLIST.viewATodo("default",myTodoDetails.title))
console.log(TODOLIST.viewATodo("Studying",myOtherTodoDetails.title))

TODOLIST.removeATodo("Studying",myOtherTodoDetails.title)
console.log(TODOLIST.viewATodo("Studying",myOtherTodoDetails.title))
console.log(TODOLIST.viewAllProjects())