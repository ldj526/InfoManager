import { auth } from "./auth/auth.js";
import { loadDialog, showDialog } from "../components/dialog.js";
import { getFirestore, doc, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", async () => {
    const db = getFirestore();
    let userId = null;
    let contactId = new URLSearchParams(window.location.search).get("contactId");

    // Firebase 인증 확인
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            userId = user.uid;
            if (contactId) {
                await loadContact(userId, contactId);
            } else {
                alert("잘못된 접근입니다.");
                window.location.href = "home.html";
            }
        } else {
            alert("로그인이 필요합니다.");
            window.location.href = "login.html";
        }
    });

    await loadDialog(); // Dialog 동적 로드

    // Firestore에서 연락처 불러오기
    async function loadContact(userId, contactId) {
        try {
            const contactRef = doc(db, `users/${userId}/contacts/${contactId}`);
            const contactSnap = await getDoc(contactRef);

            if (contactSnap.exists()) {
                const data = contactSnap.data();
                document.getElementById("contact-name").textContent = data.name || "";
                document.getElementById("contact-birthdate").textContent = data.birthdate || "";
                document.getElementById("contact-phone").textContent = data.phone || "";
                document.getElementById("contact-email").textContent = data.email || "";
                document.getElementById("contact-group").textContent = data.group || "";
                document.getElementById("contact-memo").innerHTML = data.memo ? data.memo.replace(/\\n/g, "<br>") : "";
            } else {
                alert("해당 연락처를 찾을 수 없습니다.");
                window.location.href = "home.html";
            }
        } catch (error) {
            console.error("연락처 불러오기 오류:", error.message);
            alert("연락처 정보를 불러오는 중 오류가 발생했습니다.");
        }
    }

    // 뒤로가기 버튼
    document.getElementById("back-btn").addEventListener("click", () => {
        window.location.href = "home.html";
    });

    // 수정 버튼
    document.getElementById("edit-btn").addEventListener("click", () => {
        
    });

    // 삭제 버튼
    document.getElementById("delete-btn").addEventListener("click", async () => {
        showDialog(
            "삭제하시겠습니까?",
            async () => {
                try {
                    // Firestore에서 연락처 삭제
                    const contactRef = doc(db, `users/${userId}/contacts/${contactId}`);
                    await deleteDoc(contactRef);

                    alert("연락처가 삭제되었습니다.");
                    window.location.href = "home.html";
                } catch (error) {
                    console.error("연락처 삭제 중 오류가 발생했습니다:", error.message);
                    alert("연락처 삭제에 실패했습니다. 다시 시도하세요.");
                }
            },
            () => {
                console.log("삭제 취소");
            }
        );
    });
});
