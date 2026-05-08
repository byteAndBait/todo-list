import { isMatch, formatDistanceToNow } from "date-fns";
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
            return
        }
        if (dataName === "dueDate") {

            if (modification === "") {
                state[dataName] = ""
                return
            }
            if (!isMatch(modification, 'yyyy-MM-dd')) {
                throw new Error("Not a valid date")
            }
            state[dataName] = formatDistanceToNow(modification)
            return
        }
        state[dataName] = modification
        return;
    }
})
export const projectAddTodo = (state) => ({
    addTodo: (todo) => {
        state.todos[todo.id] = todo
    }
})
export const projectRemoveTodo = (state) => ({
    removeTodo: (id) => {
        delete state.todos[id]
    }
})