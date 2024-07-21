import showPostcodeSearch from "./postcode.js";
import submitForm from "./signout.js";
import updateProfile from "./userinfoedit.js";

// 이메일 및 비밀번호 확인 폼 표시 함수
document
  .querySelector("#showPasswordForm")
  .addEventListener("click", () => fetchUserProfile());

// 사용자 정보 가져오는 함수
async function fetchUserProfile() {
  // 토큰 가져오기
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(
      "http://kdt-sw-8-team02.elicecoding.com/api/v1/me",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.ok) {
      const data = await res.json();
      showProfileUpdateForm(data.data);
    } else {
      throw new Error("에러");
    }
  } catch (e) {
    console.error(e);
  }
}

// 개인정보 수정 폼 표시 함수
function showProfileUpdateForm(userProfile) {
  document.querySelector(".main-content").innerHTML = `
    <div class="page-title">개인정보수정</div>
    <div class="separator"></div>
    <div class="profile-form">
      <label for="email">이메일 :</label>
      <input type="email" class="email" placeholder="이메일" value="${userProfile.email}">
      <label for="new-password">새 비밀번호 :</label>
      <input type="password" class="new-password" placeholder="새 비밀번호" ><br>
      <label for="confirm-password">새 비밀번호 확인 :</label>
      <input type="password" class="confirm-password" placeholder="새 비밀번호 확인"><br>
      <label for="name">이름 :</label>
      <input type="text" class="lastname" placeholder="성" value="${userProfile.lastName}">
      <input type="text" class="firstname" placeholder="이름" value="${userProfile.firstName}">
      <div class="address-wrap">
        <label for="address">주소 :</label>
        <div class="zipcode-container">
          <input type="text" class="postalCode" maxlength="5" value="${userProfile.address.postalCode}" readonly>
          <button id="searchPostcodeButton" type="button">우편번호찾기</button>
        </div>
        <input type="text" class="street" value="${userProfile.address.street}" readonly>
        <input type="text" class="detailedAddress" value="${userProfile.address.detailedAddress}">
      </div>
    </div>
    <div class="separator"></div>
    <div class="button-container">
    <button class="edit-profile-button">회원정보수정</button>
      <button class="signout-button">탈퇴하기</button>
    </div>
  `;

  // 이벤트 리스너 등록
  document
    .getElementById("searchPostcodeButton")
    .addEventListener("click", showPostcodeSearch);

  document
    .querySelector(".signout-button")
    .addEventListener("click", () => submitForm());

  document
    .querySelector(".edit-profile-button")
    .addEventListener("click", () => updateProfile());
}
