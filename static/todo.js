// --- 상태 관리 변수
let todos = [];
let selectedTodoId = null;


// 이하 모두 export
// --- 내부 변수 get
export function getTodos(){ // 복사본 반환 (원본 배열 보호)
    return [...todos];
}
export function getSelectedTodoId(){
    return selectedTodoId;
}
export function getSelectedTodos(){
    return todos.find(todo => todo.id === selectedTodoId) ?? null;
}

// --- 내부 set
export function setSelectedTodoId(id) {
    selectedTodoId = id;
}

// --- todo 제어
// todo 추가
export function addTodo(title) {
    const newTodo = {
        id: Date.now(),
        title: title,
        completed: false,
        totalTime: 0
    };
    todos.push(newTodo);
}

// todo 완료 처리
export function toggleTaskComplete(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) todo.completed = !todo.completed;
}

// todo 수행 시 걸린 시간 증가 처리
export function incrementTakenTime(id){
    const todo = todos.find(t => t.id === id);
    if (todo) todo.totalTime++;
}