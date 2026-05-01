import { startTimer, pauseTimer, resetTimer } from "./timer.js";

// --- DOM 요소 참조 가져오기
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');

// --- 이벤트 리스너
// 타이머 버튼에 연결
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);