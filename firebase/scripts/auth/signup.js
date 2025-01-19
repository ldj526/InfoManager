import { auth } from "./auth.js"
import {
    getFirestore, collection, query,
    where, getDocs, doc, setDoc,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import {
    createUserWithEmailAndPassword,
    sendEmailVerification
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js"

document.addEventListener("DOMContentLoaded", async () => {
    const signupButton = document.getElementById("signup-button");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const db = getFirestore();

    // 메시지 표시
    const emailMessage = document.querySelector(".email-message");
    const passwordMessage = document.querySelector(".password-message");
    const confirmPasswordMessage = document.querySelector(".confirm-password-message");

    let isPasswordValid = false;
    let isConfirmPasswordValid = false;
    let isEmailVerified = false;

    // 이메일 유효성 검사
    emailInput.addEventListener("input", async () => {
        const email = emailInput.value.trim().toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            emailMessage.textContent = "유효하지 않은 이메일 형식입니다.";
            emailMessage.classList.remove("valid");
            emailMessage.classList.add("invalid");
            return;
        }

        try {
            // Firestore로 이메일 중복 확인
            const methods = await checkEmailExists(email);

            if (methods.length > 0) {
                emailMessage.textContent = "이미 사용 중인 이메일입니다.";
                emailMessage.classList.remove("valid");
                emailMessage.classList.add("invalid");
            } else {
                emailMessage.textContent = "사용 가능한 이메일입니다.";
                emailMessage.classList.remove("invalid");
                emailMessage.classList.add("valid");
            }
        } catch (error) {
            console.error("Error checking email:", error.message);
            emailMessage.textContent = "이메일 확인 중 오류가 발생했습니다.";
            emailMessage.classList.remove("valid");
            emailMessage.classList.add("invalid");
        }
    });

    // 비밀번호 유효성 검사
    passwordInput.addEventListener("input", () => {
        const password = passwordInput.value;
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':",.<>?]).{8,}$/;

        if (!passwordRegex.test(password)) {
            passwordMessage.textContent = "비밀번호는 8자 이상, 숫자, 영문, 특수문자를 포함해야 합니다.";
            passwordMessage.classList.remove("valid");
            passwordMessage.classList.add("invalid");
            isPasswordValid = false;
        } else {
            passwordMessage.textContent = "비밀번호가 유효합니다.";
            passwordMessage.classList.remove("invalid");
            passwordMessage.classList.add("valid");
            isPasswordValid = true;
        }
    })

    // 비밀번호 확인 검사
    confirmPasswordInput.addEventListener("input", () => {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (password !== confirmPassword) {
            confirmPasswordMessage.textContent = "비밀번호가 일치하지 않습니다.";
            confirmPasswordMessage.classList.remove("valid");
            confirmPasswordMessage.classList.add("invalid");
            isConfirmPasswordValid = false;
        } else {
            confirmPasswordMessage.textContent = "비밀번호가 일치합니다.";
            confirmPasswordMessage.classList.remove("invalid");
            confirmPasswordMessage.classList.add("valid");
            isConfirmPasswordValid = true;
        }
    });



    // 회원가입 폼 제출
    signupButton.addEventListener("click", async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value;

        if (!isPasswordValid || !isConfirmPasswordValid) {
            alert("유효한 비밀번호를 입력해주세요!");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 인증 메일 전송
            await sendEmailVerification(user);

            // Firestore에 사용자 데이터 저장
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                createdAt: new Date()
            });

            alert("회원가입이 완료되었습니다. 이메일 인증 후 로그인하세요.");
            window.location.href = "login.html";
        } catch (error) {
            console.error("회원가입 중 오류류:", error.message);
            alert("회원가입 중 오류가 발생했습니다.");
        }
    });

    // 이메일 중복 확인
    async function checkEmailExists(email) {
        const usersRef = collection(db, "users");
        const emailQuery = query(usersRef, where("email", "==", email));

        try {
            const querySnapshot = await getDocs(emailQuery);
            return !querySnapshot.empty;
        } catch (error) {
            console.error("Firestore 이메일 확인 오류:", error.message);
            return false;
        }
    }
})