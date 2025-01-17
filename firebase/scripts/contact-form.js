function handleEmailDomainChange() {
    const domainField = document.getElementById('email-domain-field');
    const dropdown = document.getElementById('email-domain');

    if (dropdown.value === 'custom') {
        // "직접 입력" 선택 시, 입력 필드 활성화
        domainField.value = '';
        domainField.readOnly = false;
        domainField.style.backgroundColor = '#ffffff';
    } else {
        // 다른 도메인 선택 시, 입력 필드에 값 설정 및 비활성화
        domainField.value = dropdown.value;
        domainField.readOnly = true;
        domainField.style.backgroundColor = '#f0f0f0';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // 그룹 추가 기능
    document.getElementById('add-group-btn').addEventListener('click', () => {
        const newGroup = prompt('새 그룹명을 입력하세요:');
        if (newGroup) {
            const groupDropdown = document.getElementById('group-dropdown');
            const option = document.createElement('option');
            option.value = newGroup.toLowerCase();
            option.textContent = newGroup;
            groupDropdown.appendChild(option);
            alert(`그룹 "${newGroup}"이(가) 추가되었습니다.`);
        }
    });

    // 메모 자동 높이 조절
    document.getElementById('notes').addEventListener('input', function () {
        this.style.height = 'auto'; // 기존 높이 초기화
        this.style.height = `${this.scrollHeight}px`;   // 내용에 맞게 높이 조절
    });
});
