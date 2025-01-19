import { auth } from "./auth.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js"

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (user.emailVerified) {
                alert("로그인 성공!");
                window.location.href = `${window.location.origin}/firebase/home.html`;
            } else {
                alert("이메일이 인증되지 않았습니다. 인증 페이지로 이동합니다");
                window.location.href = "verify.html";
            }
        } catch (error) {
            console.error("로그인 에러", error.message);
            alert("로그인 실패");
        }
    });
});