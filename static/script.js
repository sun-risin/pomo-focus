// 상태 관리 변수
let timerInterval = null;       // 1초 단위 누적 시간 갱신용
let totalSettingSeconds = 1800; // 전체 설정 시간 - 기본 30분
let remainingSeconds = 1800;    // 남은 시간

// DOM 요소
const settingArea = document.getElementById('settingArea');

// 설정 읽기
function getSettingTime() {
    const m = parseInt(document.getElementById('setMin').value) || 0;
    const s = parseInt(document.getElementById('setSec').value) || 0;
    return (m * 60) + s;
}

// 일단 숫자만 바뀌게
function updateTextOnly() {
    const m = Math.floor(remainingSeconds / 60);
    const s = remainingSeconds % 60;
    document.getElementById('timerMinutes').innerText = String(m).padStart(2, '0');
    document.getElementById('timerSeconds').innerText = String(s).padStart(2, '0');
    
    // 나중에 todo랑 관련 지어서 누적시간 넣기!
}

// --- 타이머 제어 함수들
// start
function startTimer() {
    // 나중에 Todo 선택 여부랑 연결!

    // 시작 시 제어 버튼들 숨기기
    settingArea.classList.add('hidden');
    
    // 설정창의 값을 읽어와서 기준 시간 설정
    const total = getSettingTime();
    totalSettingSeconds = total;
    
    if (totalSettingSeconds <= 0) return;
    
    timerInterval = setInterval(() => {
        if (remainingSeconds <= 0) {
            clearInterval(timerInterval);
            return;
        }
        remainingSeconds--;
        updateTextOnly();
    }, 1000);
}

// pause
function pauseTimer() {
    // 나머지 UI 적용 로직 추가 예정
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    settingArea.classList.remove('hidden');
}

// reset
function resetTimer() {
    pauseTimer();

    const total = getSettingTime();
    totalSettingSeconds = total;
    remainingSeconds = total;

    updateTextOnly();
    // 나머지 UI 적용 로직 추가 예정
}

// 이벤트 리스너 연결
document.getElementById('startBtn').addEventListener('click', startTimer);
document.getElementById('pauseBtn').addEventListener('click', pauseTimer);
document.getElementById('resetBtn').addEventListener('click', resetTimer);