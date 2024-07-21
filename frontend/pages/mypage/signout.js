import URL from "../common/data/url";

// 탈퇴하기 함수
async function deleteAccount() {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "http://kdt-sw-8-team02.elicecoding.com/api/v1/auth/withdraw",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      localStorage.removeItem("token");
      window.location.href = URL.MAIN_PAGE_URL;
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
  } catch (error) {
    // 에러 처리
    console.error("Error deleting account:", error);
    alert("계정 삭제 중 오류가 발생했습니다.");
  }
}

// 폼 제출 함수
const submitForm = () => {
  if (
    confirm(
      "정말 탈퇴하시겠습니까?\n탈퇴시 모든 정보는 복구가 불가능합니다.\n한 번 탈퇴하면 되돌릴 수 없습니다."
    )
  ) {
    deleteAccount(); // deleteAccount 함수 호출
  } else {
    // "탈퇴"를 입력하지 않은 경우에 대한 처리
    alert("탈퇴를 원하시면 '탈퇴'를 입력해주세요.");
  }
};
export default submitForm;
