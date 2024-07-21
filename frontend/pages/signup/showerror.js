import URL from "../common/data/url";

async function signup(e) {
  e.preventDefault(); // 기본 이벤트 중지

  // 이메일 유효성 검사
  let email = document.getElementById("email").value;
  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showError("이메일을 올바른 형식으로 입력하세요.");
    return;
  }

  // 비밀번호 확인
  let password = document.getElementById("password").value;
  let confirmPassword = document.getElementById("confirmPassword").value;
  if (password !== confirmPassword) {
    showError("비밀번호가 일치하지 않습니다.");
    return;
  }

  // 모든 필수 입력 값 확인
  let lastName = document.getElementById("last-name").value;
  let firstName = document.getElementById("first-name").value;
  let postalCode = document.getElementsByName("postalCode")[0].value;
  let street = document.getElementsByName("street")[0].value;
  let detailedAddress = document.getElementsByName("detailedAddress")[0].value;
  const address = { street, detailedAddress, postalCode };

  if (
    email === "" ||
    password === "" ||
    confirmPassword === "" ||
    lastName === "" ||
    firstName === "" ||
    postalCode === "" ||
    street === "" ||
    detailedAddress === ""
  ) {
    showError("모든 항목을 입력하세요.");
    return;
  }

  // 서버에 데이터 전송
  try {
    const data = { email, password, lastName, firstName, address };
    const response = await fetch(
      "http://kdt-sw-8-team02.elicecoding.com/api/v1/auth/sign-up",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data }),
      }
    );
    if (response.ok) {
      alert("회원가입을 축하드립니다! 2STEP과 한걸음 더 나아가요.");
      window.location.href = URL.MAIN_PAGE_URL;
    } else {
      throw new Error("이미 가입된 정보가 존재합니다.");
    }
  } catch (error) {
    console.error("Fetch 오류:", error);
    showError("이미 가입된 정보가 존재합니다.");
  }
}

function showError(message) {
  let errorMessages = document.getElementById("error-messages");
  errorMessages.innerHTML =
    "<p>" + message + "</p><hr><button id='hideError'>확인</button>";
  errorMessages.style.display = "block"; // 화면에 표시

  errorMessages
    .querySelector("#hideError")
    .addEventListener("click", () => hideError());
}

function hideError() {
  let errorMessages = document.getElementById("error-messages");
  if (errorMessages) {
    errorMessages.style.display = "none"; // 화면에서 숨기기
  }
}

// 이벤트 리스너 등록
document.querySelector(".signup-form-wrap").addEventListener("submit", signup);
