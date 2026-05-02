import { api } from "./API.js";

// --- 상태 관리 변수
let todos = [];
let selectedTodoId = null;

// --- DOM 요소 참조 가져오기
const todoList = document.getElementById('todoList');
const activeTaskTitle = document.getElementById('activeTaskTitle');

// 이하 모두 export
// --- 내부 변수 get
export function getTodos(){ // 복사본 반환 (원본 배열 보호)
    return [...todos];
}
export function getSelectedTodoId(){
    return selectedTodoId;
}
export function isSelectedTodo() {
    return todos.find(t => t.id === selectedTodoId) ?? null;
}
// id로 특정 todo total time조회
export function getTotalTimeByTodoId(id) {
  const todo = todos.find(t => t.id === id) ?? null;
  return todo.totalTime;
}

// --- 내부 set
export function setSelectedTodoId(id) {
    selectedTodoId = id;
}

// --- todo 제어
// 서버에서 받아온 데이터로 초기화
export function loadTodos(dbTodos){
    todos = [...dbTodos];
}

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
export function incrementTakenTime(id, newTaken){
    const todo = todos.find(t => t.id === id);
    if (todo) todo.totalTime += newTaken;
}

// --- todo 렌더링 관련
// 시간 포맷팅 유틸리티
function formatAccumulated(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// 렌더링 함수 : export
export function renderTodos() {
    todoList.innerHTML = '';

    getTodos().forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${selectedTodoId === todo.id ? 'active' : ''} ${todo.completed ? 'completed' : ''}`;

        li.innerHTML = `
            <input type="checkbox" ${todo.completed ? 'checked' : ''}>
            <span>${todo.title}</span>
            <span class="todo-time-tag">${formatAccumulated(todo.totalTime)}</span>
        `;

        li.querySelector('input').addEventListener('click', async (e) => {
            e.stopPropagation();
            toggleTaskComplete(todo.id);
            renderTodos();
            await api.updateCompleted(todo.id, todo.completed);
        });

        li.addEventListener('click', () => {
            setSelectedTodoId(todo.id);
            activeTaskTitle.innerText = todo.title;
            renderTodos();
        });

        todoList.appendChild(li);
    })
}