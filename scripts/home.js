import { loadDialog, showDialog } from "../components/dialog.js";

document.addEventListener('DOMContentLoaded', async () => {
    await loadDialog(); // Dialog 동적 로드

    document.querySelectorAll('.delete-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            showDialog(
                '연락처를 삭제하시겠습니까?',
                () => {
                    console.log('삭제 확인');
                },
                () => {
                    console.log('삭제 취소');
                }
            );
        });
    });
});
