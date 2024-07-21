import URL from "../common/data/url";

window.addEventListener("load", function () {
  const loginToken = localStorage.getItem("token");

  if (loginToken) {
    window.location.href = URL.MAIN_PAGE_URL;
  }
});

// 로그인 처리 함수
async function handleLogin() {
  const email = document.querySelector(".email").value; // 이메일 입력값 가져오기
  const password = document.querySelector(".password").value; // 비밀번호 입력값 가져오기

  // 이메일 또는 비밀번호가 입력되지 않은 경우
  if (email === "" || password === "") {
    alert("이메일 또는 비밀번호를 입력해 주세요");
    return;
  }
  if (!isValidEmail(email)) {
    alert("유효하지 않은 이메일 형식입니다");
    return;
  }
  // API 수정 필요
  try {
    const data = { email, password };
    const response = await fetch(
      "http://kdt-sw-8-team02.elicecoding.com/api/v1/auth/sign-in",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      const token = data.data; // 서버에서 받은 토큰
      localStorage.setItem("token", token); // 토큰을 로컬 스토리지에 저장
      localStorage.setItem("userId", email); // 유저아이디를 로컬 스토리지에 저장

      window.location.href = URL.MAIN_PAGE_URL; // 로그인 성공 시 페이지 이동
    } else {
      throw new Error("로그인 실패");
    }
  } catch (error) {
    console.error("로그인 요청 실패:", error);
    alert("이메일 또는 비밀번호를 다시 확인해주세요");
  }
}

//이메일 유효성 검사 함수
function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 이메일 정규식 패턴
  return emailPattern.test(email); // 정규식 패턴과 일치하는지 검사하여 결과 반환
}

// 클릭 이벤트 리스너
document.addEventListener("click", function (event) {
  event.preventDefault();
  const target = event.target;

  if (target.classList.contains("login-btn")) {
    handleLogin(); // 로그인 함수 호출
  }
  if (target.classList.contains("signup-btn")) {
    window.location.href = URL.SIGN_UP_URL; // 회원가입 페이지로 이동
  }
  if (target.classList.contains("adminlogin-link")) {
    alert("준비중입니다.");
  }
});
