import URL from "../../common/data/url.js";

document
  .querySelector(".go-mainpage")
  .addEventListener("click", () => (window.location.href = URL.MAIN_PAGE_URL));

document
  .querySelector(".go-mypage")
  .addEventListener("click", () => (window.location.href = URL.MY_PAGE_URL));
