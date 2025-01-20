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