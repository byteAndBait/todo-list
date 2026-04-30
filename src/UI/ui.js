import "../css/main.css"
import "../css/normalize.css"
import { viewAllProjects } from "../coreLogic/todoList.js"
const projectsList = document.querySelector("nav.sideBar .projectsList")
const mainContentElement = document.querySelector("main.content")
let Projects = viewAllProjects()

function updateProjectsList(){
    projectsList.textContent = ''
    const projectNames = [];
    
    for(let i in Projects){
        const project = Projects[i]
        projectNames.push(project.name)
    }

    for(let i in projectNames){
        const projectName = projectNames[i]
        projectsList.appendChild(createProjectButton(projectName))
    }
    



    function createProjectButton(projectName){
        const projectButton = document.createElement("button")
        projectButton.classList.add("projectButton")
        projectButton.dataset.projectName = projectName
        projectButton.textContent = projectName
        return projectButton
    }
}
function updateScreen(){
    updateProjectsList()
    projectsList.addEventListener("click",(e)=>{
        if(e.target.className == "projectButton"){
            showContentOfAProject(e.target.dataset.projectName)
        }
    })
}
updateScreen()
function showContentOfAProject(projectName){
    mainContentElement.textContent = ""
    const todos = Projects[projectName].todos


    for(let i in todos){
        mainContentElement.appendChild(createTodoElement(todos[i]))
    }

    function createTodoElement(todo){
            const todoElement = document.createElement("div")
            todoElement.className = "todo"
            
            const todoTitle = document.createElement("h1")
            todoTitle.className = "todoTitle"
            todoTitle.textContent = todo.title

            const todoDescription = document.createElement("p")
            todoDescription.className = "todoDescription"
            todoDescription.textContent = todo.description

            const todoCompletion = document.createElement("span")
            todoCompletion.className = "todoCompletion"
            todoCompletion.textContent = todo.completed
            
            todoElement.append(todoTitle,todoDescription,todoCompletion)
            return todoElement
    }
}


