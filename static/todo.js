// --- 상태 관리 변수
let todoList = [];
let selectedTodoId = null;

// --- 내부 변수 get, set : export
export function getTodoList(){ // todos는 읽기만 필요
    return todoList;
}

export function getSelectedTodoId(){
    return selectedTodoId;
}

export function setSelectedTodoId(id) {
    selectedTodoId = id;
}

// --- todo 제어 : export
// todo 추가
export function addTodo(title) {
    const newTodo = {
        id: Date.now(),
        title: title,
        completed: false,
        totalTime: 0
    };
    todoList.append(newTodo);
    return newTodo;
}

// todo 완료 처리
export function toggleTaskComplete(id, isChecked) {
    const todo = todoList.find(t => t.id === id);
    if (todo) {
        todo.completed = isChecked;
    }
    return todo;
}