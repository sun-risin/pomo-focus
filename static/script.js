import * as TimerModule from "./timer.js";
import * as TodoModule from "./todo.js";
import { api } from "./API.js";

// --- DOM 요소 참조 가져오기
// 타이머 버튼
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');

// todo 관련
const todoList = document.getElementById('todoList');
const todoInput = document.getElementById('todoInput');
const addTodoBtn = document.getElementById('addTodoBtn');


// --- 경과 기록 및 재렌더링 : 타이머 만료 or 정지 시
async function commitTakenTime(){
    const newTaken = TimerModule.getTakenTime();
    const selectedId = TodoModule.getSelectedTodoId();

    // 시간이 흘렀을 때만 업데이트
    if (selectedId !== null && newTaken > 0) {
        // 브라우저
        TodoModule.incrementTakenTime(selectedId, newTaken);
        TodoModule.renderTodos();

        // 서버
        const todoTotalTime = TodoModule.getTotalTimeByTodoId(selectedId);
        await api.updateTime(selectedId, todoTotalTime);
    }
}

// --- 이벤트 리스너 연결 및 설정
// 타이머 버튼
startBtn.addEventListener('click', () => {
    if (!TodoModule.isSelectedTodo()) return;

    TimerModule.startTimer(() => {
        commitTakenTime();
    });
});

pauseBtn.addEventListener('click', () => {
    TimerModule.pauseTimer();
    commitTakenTime();
});

resetBtn.addEventListener('click', TimerModule.resetTimer);

// todo 추가 버튼
addTodoBtn.addEventListener('click', async () => {
    TodoModule.addTodo(todoInput.value);
    todoInput.value = '';
    TodoModule.renderTodos();
    await api.saveAll(); // todo 추가 후 전체 저장
});

// --- 초기화
(async () => {
  const dbTodos = await api.loadTodos();
  TodoModule.loadTodos(dbTodos);
  TodoModule.renderTodos();
})();