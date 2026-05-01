// --- 상태 관리 변수
let timerInterval = null;       // 1초 단위 누적 시간 갱신용
let remainingSeconds = 1800;    // 남은 시간
let initialRemaining = remainingSeconds;
let animationFrameId = null;    // 원형 타이머 부드러운 애니메이션용

// --- DOM 요소 참조 가져오기
const settingArea = document.getElementById('settingArea');
const settingMin = document.getElementById('setMin');
const settingSec = document.getElementById('setSec');
const remainTimerMin = document.getElementById('timerMinutes');
const remainTimerSec = document.getElementById('timerSeconds');

const timerCircle = document.getElementById('timerCircle');

// --- 내부 변수 get
// 설정 읽기
function getSettingTime() {
    const m = parseInt(settingMin.value) || 0;
    const s = parseInt(settingSec.value) || 0;
    return (m * 60) + s;
}
// 작동 중인지
function isRunning() {
    return animationFrameId !== null;
}
// 남은 시간 get : export
export function getRemainingSeconds() {
    return remainingSeconds;
}
// 초기 남은 시간 get : export
export function getInitialRemaining() {
    return initialRemaining;
}


// --- 타이머 시각적 업데이트
// 진행도 시각화 - 원형 모양 변경
function updateTimerVisual(progress) {
    timerCircle.style.setProperty('--progress', progress);
}

// 텍스트 변경
function updateTimerText() {
    const m = Math.floor(remainingSeconds / 60);
    const s = remainingSeconds % 60;
    remainTimerMin.innerText = String(m).padStart(2, '0');
    remainTimerSec.innerText = String(s).padStart(2, '0');
}

// --- 타이머 제어 함수들 : export
// start
export function startTimer(onTick, onFinish) {
    if (isRunning()) return;

    // 시작 시 세팅 칸 숨기기
    settingArea.classList.add('hidden');
    
    const totalMs = remainingSeconds * 1000;
    const startTime = performance.now();
    
    // 애니메이션 루프 (circle 진행도 업데이트)
    function animate(currentTime) {
        const elapsedMs = currentTime - startTime;
        const currentRemainingMs = totalMs - elapsedMs;

        if (currentRemainingMs <= 0) {
            // 보정 - 종료 시점에 정확한 값 강제 주입
            remainingSeconds = 0;

            pauseTimer();
            updateTimerVisual(0);
            updateTimerText();
            return;
        }

        // 화면 표시용 초 단위 업데이트
        remainingSeconds = Math.ceil(currentRemainingMs / 1000);
        
        // 실시간 퍼센트 계산 (requestAnimationFrame으로 매 프레임 갱신)
        const currentProgress = (currentRemainingMs / totalMs) * 100;
        updateTimerVisual(currentProgress);
        updateTimerText();
        
        animationFrameId = requestAnimationFrame(animate);
    }
    animationFrameId = requestAnimationFrame(animate);

    timerInterval = setInterval(() => {
        if (remainingSeconds <= 0) {
            clearInterval(timerInterval);
            settingArea.classList.remove('hidden');
            return;
        }
        remainingSeconds--;
        updateTimerText();
    }, 1000);
}

// pause
export function pauseTimer() {
    if (!isRunning()) return;
    
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    settingArea.classList.remove('hidden');
}

// reset
export function resetTimer() {
    if (isRunning()) {
        alert("일시정지 후 재설정하세요.");
        return;
    }
    pauseTimer();

    const total = getSettingTime();
    remainingSeconds = total;
    initialRemaining = remainingSeconds;

    updateTimerVisual(100);
    updateTimerText();
}