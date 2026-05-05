export const todoEdit = (state) => ({
    edit: (dataName, modification) => {

        if (dataName === "priority") {
            switch (modification) {
                case "Low":
                    state.priority = "Low"
                    break;
                case "Medium":
                    state.priority = "Medium"
                    break
                case "High":
                    state.priority = "High"
                    break
                default:
                    return "Please enter Priority [Low,Medium,High]"
            }
        }
        state[dataName] = modification
        return;
    }
})
export const projectAddTodo = (state) => ({
    addTodo: (todo) => {
        state.todos[todo.title] = todo
    }
})
export const projectRemoveTodo = (state) => ({
    removeTodo: (title) => {
        delete state.todos[title]
    }
})