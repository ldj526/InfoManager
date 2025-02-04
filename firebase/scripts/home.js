import { auth } from "./auth/auth.js";
import { loadDialog, showDialog } from "/components/dialog.js";
import { getFirestore, collection, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', async () => {
    const db = getFirestore();
    let userId = null;

    // 사용자 인증 상태 확인
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            userId = user.uid;
            await fetchContacts(userId);
        } else {
            alert("로그인이 필요합니다.");
            window.location.href = "/auth/login.html";
        }
    });

    await loadDialog(); // Dialog 동적 로드

    // Firestore로부터 데이터 가져오기
    async function fetchContacts(userId) {
        const contactList = document.getElementById('contact-list');
        contactList.innerHTML = '';

        try {
            const contactsCollection = collection(db, `users/${userId}/contacts`);
            const querySnapshot = await getDocs(contactsCollection);

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const contactItem = document.createElement('li');
                contactItem.className = 'contact-item';

                contactItem.innerHTML = `
                    <div class="contact-info">
                        <span class="contact-name">${data.name}</span>
                        <span class="contact-phone">${data.phone || '-'}</span>
                        <span class="contact-email">${data.email || '-'}</span>
                    </div>
                    <div class="contact-actions">
                        <button class="edit-btn">수정</button>
                        <button class="delete-btn">삭제</button>
                    </div>
                `;

                // 상세 페이지로 이동
                contactItem.addEventListener("click", () => {
                    window.location.href = `contact-detail.html?contactId=${doc.id}`;
                });

                // 삭제 버튼
                const deleteBtn = contactItem.querySelector('.delete-btn');
                deleteBtn.addEventListener('click', (event) => {
                    event.stopPropagation();    // 부모 클릭 이벤트 방지
                    handleDeleteContact(userId, doc.id, data.name);
                });

                // 수정 버튼
                const editBtn = contactItem.querySelector('.edit-btn');
                editBtn.addEventListener('click', (event) => {
                    event.stopPropagation();
                    window.location.href = `contact-form.html?contactId=${doc.id}`;
                });

                contactList.appendChild(contactItem);
            });
        } catch (error) {
            console.error("연락처를 가져오는 중 오류 발생:", error.message);
        }
    }

    // 연락처 삭제
    async function handleDeleteContact(userId, contactId, contactName) {
        showDialog(
            `"${contactName}" 연락처를 삭제하시겠습니까?`,
            async () => {
                try {
                    // Firestore에서 연락처 삭제
                    const contactRef = doc(db, `users/${userId}/contacts/${contactId}`);
                    await deleteDoc(contactRef);

                    alert("연락처가 삭제되었습니다.");
                    await fetchContacts(userId); // 삭제 후 목록 갱신
                } catch (error) {
                    console.error("연락처 삭제 중 오류가 발생했습니다:", error.message);
                    alert("연락처 삭제에 실패했습니다. 다시 시도하세요.");
                }
            },
            () => {
                console.log("삭제 취소");
            }
        );
    }
});

// 클릭 시 contact-form.html로 이동
document.getElementById('add-contact-btn').addEventListener('click', () => {
    window.location.href = 'contact-form.html';
});