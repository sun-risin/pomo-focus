// --- 상태 관리 변수
let timerInterval = null;       // 1초 단위 누적 시간 갱신용
let totalSettingSeconds = 1800; // 전체 설정 시간 - 기본 30분
let remainingSeconds = 1800;    // 남은 시간

// --- DOM 요소 참조 가져오기
const settingArea = document.getElementById('settingArea');
const settingMin = document.getElementById('setMin');
const settingSec = document.getElementById('setSec');
const remainTimerMin = document.getElementById('timerMinutes');
const remainTimerSec = document.getElementById('timerSeconds');

// 설정 읽기
function getSettingTime() {
    const m = parseInt(settingMin.value) || 0;
    const s = parseInt(settingSec.value) || 0;
    return (m * 60) + s;
}

// --- 시각적 업데이트
// 나중에 원형 타이머 진행도 업데이트 기능 추가하기
// 텍스트 변경
function updateTextOnly() {
    const m = Math.floor(remainingSeconds / 60);
    const s = remainingSeconds % 60;
    remainTimerMin.innerText = String(m).padStart(2, '0');
    remainTimerSec.innerText = String(s).padStart(2, '0');
    
    // 나중에 todo랑 관련 지어서 누적시간 넣기!
}

// --- 타이머 제어 함수들 : export
// start
export function startTimer() {
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
            settingArea.classList.remove('hidden');
            return;
        }
        remainingSeconds--;
        updateTextOnly();
    }, 1000);
}

// pause
export function pauseTimer() {
    // 나머지 UI 적용 로직 추가 예정
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    settingArea.classList.remove('hidden');
}

// reset
export function resetTimer() {
    pauseTimer();

    const total = getSettingTime();
    totalSettingSeconds = total;
    remainingSeconds = total;

    updateTextOnly();
    // 나머지 UI 적용 로직 추가 예정
}