import { auth } from "./auth/auth.js";
import { getFirestore, collection, doc, setDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js"

document.addEventListener("DOMContentLoaded", async () => {
    const db = getFirestore();
    const groupDropdown = document.getElementById('group-dropdown');
    const addGroupButton = document.getElementById('add-group-btn');
    const emailDropdown = document.getElementById('email-domain');
    emailDropdown.addEventListener('change', handleEmailDomainChange);
    let userId = null;

    // Firebase 인증 초기화
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            userId = user.uid; // 인증된 사용자 ID
            await loadGroup();
        } else {
            alert("로그인이 필요합니다.");
            window.location.href = "login.html"; // 로그인 페이지로 리다이렉트
        }
    });

    // Firestore에서 그룹 로드
    async function loadGroup() {
        try {
            groupDropdown.innerHTML = `<option value="">-- 선택 --</option>`;
            const groupsCollection = collection(db, `users/${userId}/groups`)
            const querySnapshot = await getDocs(groupsCollection);

            querySnapshot.forEach(doc => {
                const option = document.createElement('option');
                option.value = doc.id;
                option.textContent = doc.id;
                groupDropdown.appendChild(option);
            });
        } catch (error) {
            console.error("그룹 로드 실패:", error.message);
        }
    }

    // Firestore에 그룹 추가
    async function addGroupToFirestore(groupName) {
        try {
            const groupId = groupName.toLowerCase().replace(/\s+/g, '-');
            const groupRef = doc(db, `users/${userId}/groups/${groupId}`);
            await setDoc(groupRef, {});
            alert(`그룹 "${groupName}"이(가) 추가되었습니다.`);
        } catch (error) {
            console.error("그룹 추가 실패:", error.message);
        }
    }

    // 그룹 추가 기능
    addGroupButton.addEventListener('click', async (e) => {
        e.preventDefault();

        const newGroup = prompt('새 그룹명을 입력하세요');
        if (newGroup) {
            await addGroupToFirestore(newGroup);

            const option = document.createElement('option');
            option.vlaue = newGroup.toLowerCase()
            option.textContent = newGroup;
            groupDropdown.appendChild(option);
        }
    })

    // 메모 자동 높이 조절
    document.getElementById('notes').addEventListener('input', function () {
        const maxHeight = 200;

        this.style.height = 'auto'; // 기존 높이 초기화
        if (this.scrollHeight > maxHeight) {
            // 최대 높이 초과하면 스크롤 생기게
            this.style.height = `${maxHeight}px`;
            this.style.overflowY = 'auto';
        } else {
            // 최대 높이 초과하지 않으면 높이를 scrollHeight으로 지정
            this.style.height = `${this.scrollHeight}px`;
            this.style.overflowY = 'hidden';
        }
    });

    // 연락처 추가
    async function addContact(userId, contactData) {
        try {
            // 연락처 collection 생성
            const contactsCollection = collection(db, `users/${userId}/contacts`);
            const contactRef = doc(contactsCollection); // ID 생성

            const contactPayload = {
                name: contactData.name,
                birthdate: contactData.birthdate || null,
                phone: contactData.phone || null,
                email: contactData.email || null,
                group: contactData.group || null,
                memo: contactData.memo || null,
            };

            // Firestore 저장
            await setDoc(contactRef, contactPayload);
            alert("연락처 추가 성공");
            console.log("연락처 추가 성공");
        } catch (error) {
            console.error("연락처 추가 오류:", error.message);
        }
    }

    // 저장 버튼
    document.getElementById('save-btn').addEventListener('click', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const birthdate = document.getElementById('birthdate').value || null;
        const phone = document.getElementById('phone-prefix').value && document.getElementById('phone-middle').value && document.getElementById('phone-last').value
            ? `${document.getElementById('phone-prefix').value}-${document.getElementById('phone-middle').value}-${document.getElementById('phone-last').value}`
            : null;
        const email = document.getElementById('email-id').value && document.getElementById('email-domain-field').value
            ? `${document.getElementById('email-id').value}@${document.getElementById('email-domain-field').value}`
            : null;
        const group = document.getElementById('group-dropdown').value || null;
        const memo = document.getElementById('notes').value.replace(/\r?\n/g, "\\n") || null;

        if (!name.trim()) {
            alert("이름은 필수 항목입니다!");
            return;
        }

        await addContact(userId, { name, birthdate, phone, email, group, memo });
        window.location.href = `${window.location.origin}/firebase/home.html`;
    })

    // 취소 버튼
    document.getElementById('cancel-btn').addEventListener('click', async (e) => {
        e.preventDefault();
        window.location.href = `${window.location.origin}/firebase/home.html`;
    })
});

// 이메일 도메인 바꾸기
function handleEmailDomainChange() {
    const domainField = document.getElementById('email-domain-field');
    const dropdown = document.getElementById('email-domain');

    if (dropdown.value === 'custom') {
        // "직접 입력" 선택 시, 입력 필드 활성화
        domainField.value = '';
        domainField.readOnly = false;
        domainField.style.backgroundColor = '#ffffff';
    } else if (dropdown.value === '') {
        // 선택하지 않았을 시
        domainField.value = '';
        domainField.readOnly = true;
        domainField.style.backgroundColor = '#f0f0f0';
    } else {
        // 다른 도메인 선택 시, 입력 필드에 값 설정 및 비활성화
        domainField.value = dropdown.value;
        domainField.readOnly = true;
        domainField.style.backgroundColor = '#f0f0f0';
    }
}