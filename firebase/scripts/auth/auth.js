// Firebase SDK 가져오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// Firebase 구성
const firebaseConfig = {
    apiKey: "AIzaSyCgM-msV9kbU8PD_rmo-vlcGYxmGZOjrog",
    authDomain: "infomanager-cfd4c.firebaseapp.com",
    projectId: "infomanager-cfd4c",
    storageBucket: "infomanager-cfd4c.firebasestorage.app",
    messagingSenderId: "335237140278",
    appId: "1:335237140278:web:0e7464b2e6a0edb95d6d97",
    measurementId: "G-Y2NX5X17JV"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 사용자 정보 로드
export function getCurrentUser() {
    return auth.currentUser;
}

// Firebase Auth 객체 내보내기
export { auth };