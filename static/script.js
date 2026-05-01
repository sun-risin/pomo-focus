import * as TimerModule from "./timer.js";
import * as TodoModule from "./todo.js";

// --- DOM 요소 참조 가져오기
// 타이머 버튼
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');

// todo 관련
const todoList = document.getElementById('todoList');
const todoInput = document.getElementById('todoInput');
const addTodoBtn = document.getElementById('addTodoBtn');


// --- 이벤트 리스너 연결 및 설정
// 타이머 버튼
startBtn.addEventListener('click', TimerModule.startTimer);
pauseBtn.addEventListener('click', TimerModule.pauseTimer);
resetBtn.addEventListener('click', TimerModule.resetTimer);

// todo 추가 버튼
addTodoBtn.addEventListener('click', () => {
    TodoModule.addTodo(todoInput.value);
    todoInput.value = '';
    TodoModule.renderTodos();
});