let dialogLoaded = false;

export async function loadDialog() {
    if (dialogLoaded) return;

    // Dialog가 존재할 경우 숨김 처리
    const dialog = document.getElementById('dialog');
    if (dialog) {
        dialog.classList.add('hidden');
        dialogLoaded = true; 
        return;
    }

    try {
        // Dialog HTML 동적로드
        const response = await fetch(`${window.location.origin}/firebase/components/dialog.html`);
        const dialogHTML = await response.text();
        document.body.insertAdjacentHTML('beforeend', dialogHTML);

        // Dialog CSS 동적로드
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `${window.location.origin}/firebase/components/dialog.css`;
        document.head.appendChild(link);

        // Dialog 초기 숨김 처리
        const newDialog = document.getElementById('dialog');
        newDialog.classList.add('hidden');

        dialogLoaded = true;
    } catch (error) {
        console.error('다이얼로그 로드 중:', error);
    }
}

export function showDialog(message, onConfirm, onCancel) {
    const dialog = document.getElementById('dialog');
    const dialogMessage = document.getElementById('dialog-message');
    const confirmBtn = document.getElementById('dialog-confirm-btn');
    const cancelBtn = document.getElementById('dialog-cancel-btn');

    // 메세지
    dialogMessage.textContent = message;

    // 확인 버튼
    confirmBtn.onclick = () => {
        onConfirm();
        hideDialog();
    }

    // 취소 버튼
    cancelBtn.onclick = () => {
        onCancel();
        hideDialog();
    }

    // Dialog 표시
    dialog.classList.remove('hidden');
}

// Dialog 숨기기
export function hideDialog() {
    const dialog = document.getElementById('dialog');
    dialog.classList.add('hidden');
}