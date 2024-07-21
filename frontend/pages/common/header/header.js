import URL from "../data/url";

function createHeader() {
  const header = document.getElementById("header");

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "/common/header/styles.css";
  document.head.appendChild(link);

  const container = document.createElement("div");
  container.className = "container-box";
  header.appendChild(container);

  const logo = document.createElement("div");
  logo.className = "logo";
  const a = document.createElement("a");
  a.href = URL.MAIN_PAGE_URL;
  const img = document.createElement("img");
  img.src = "/common/header/2STEP.png";
  img.alt = "로고";
  a.appendChild(img);
  logo.appendChild(a);
  container.appendChild(logo);

  const bottom = document.createElement("div");
  bottom.className = "list-container";
  container.appendChild(bottom);

  const nav = document.createElement("nav");
  bottom.appendChild(nav);

  const menu = document.createElement("ul");
  menu.className = "menu";
  nav.appendChild(menu);

  const menuItems = [
    "NEW",
    "BEST",
    "SALE",
    "|",
    "WOMEN",
    "MEN",
    "LIFE",
    "ACTIVE",
  ];
  menuItems.forEach((item) => {
    const li = document.createElement("li");
    if (item === "|") {
      li.textContent = item;
    } else {
      const a = document.createElement("a");
      a.href = `${URL.PRODUCT_LIST_PAGE_URL}?category=${item}`;
      a.textContent = item;
      li.appendChild(a);
    }
    menu.appendChild(li);
  });

  const userMenu = document.createElement("ul");
  userMenu.className = "user-menu";
  nav.appendChild(userMenu);

  let userMenuItems = ["LOGIN", "JOIN", "CART", "MYPAGE"];

  const loginToken = localStorage.getItem("token");

  let loginSuccess = false;

  if (loginToken) {
    loginSuccess = true;
    userMenuItems = ["LOGOUT", "CART", "MYPAGE"];
  }

  userMenuItems.forEach((item) => {
    const li = document.createElement("li");
    const a = userMenuCreate(item, loginSuccess);
    li.appendChild(a);
    userMenu.appendChild(li);
  });
}

function userMenuCreate(item, loginSuccess) {
  const a = document.createElement("a");
  a.textContent = item;
  if (item === "LOGIN") {
    a.href = URL.LOGIN_URL;
    a.textContent = item;
  }
  if (item === "LOGOUT") {
    a.textContent = item;
    a.addEventListener("click", function (e) {
      e.preventDefault();

      localStorage.removeItem("token");
      localStorage.removeItem("order");
      localStorage.removeItem("products");
      location.reload();
    });
  }
  if (item === "JOIN") {
    a.href = URL.SIGN_UP_URL;
    a.textContent = item;
  }
  if (item === "CART") {
    a.href = URL.CART_URL;
    a.textContent = item;
  }
  if (item === "MYPAGE") {
    a.textContent = item;
    if (loginSuccess) {
      a.href = URL.MY_PAGE_URL;
    } else {
      a.addEventListener("click", function (e) {
        e.preventDefault();

        alert("비회원은 준비중입니다.");
        window.location.href = URL.LOGIN_URL;
      });
    }
  }

  return a;
}

export default createHeader;
