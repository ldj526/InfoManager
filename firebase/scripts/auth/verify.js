import { auth } from "./auth.js";
import { sendEmailVerification, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js"

document.addEventListener("DOMContentLoaded", () => {
    const resendButton = document.getElementById("resend-email");
    const checkVerificationButton = document.getElementById("check-verification");
    let currentUser = null;

    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = user;
        } else {
            currentUser = null;
            alert("로그인 후 시도해주세요.");
            window.location.href = `${window.location.origin}/firebase/auth/login.html`;
        }
    })

    // 이메일 재전송 버튼
    resendButton.addEventListener("click", async () => {
        if (!currentUser) {
            alert("로그인 후 시도해주세요.");
            return;
        }

        try {
            await sendEmailVerification(currentUser);
            alert("이메일 전송 성공.");
        } catch (error) {
            console.error("이메일 전송 실패:", error.message);
            alert("이메일 전송 실패");
        }
    });

    // 수동 인증 상태 확인
    checkVerificationButton.addEventListener("click", async () => {
        if (!currentUser) {
            alert("로그인 후 시도해주세요.");
            return;
        }

        try {
            await currentUser.reload();
            if (currentUser.emailVerified) {
                alert("이메일 인증 성공!");
                window.location.href = `${window.location.origin}/firebase/home.html`;
            } else {
                alert("이메일 인증이 아직 완료되지 않았습니다.");
            }
        } catch (error) {
            console.error("사용자 상태 새로고침 실패:", error.message);
            alert("인증 상태 확인 중 오류가 발생했습니다.");
        }
    });
});