import URL from "../data/url";

function createFooter() {
  const footer = document.getElementById("footer");

  const box = document.createElement("div");
  box.className = "container-box";

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "/common/footer/styles.css";
  document.head.appendChild(link);

  const container = document.createElement("div");
  container.className = "introduce-container";
  box.appendChild(container);

  const logo = document.createElement("div");
  logo.className = "logo";
  const a = document.createElement("a");
  a.href = URL.MAIN_PAGE_URL;
  const img = document.createElement("img");
  img.src = "/common/footer/2STEP.png";
  img.alt = "로고";
  a.appendChild(img);
  logo.appendChild(a);
  container.appendChild(logo);

  const company = document.createElement("div");
  company.className = "company";
  company.innerHTML = `
    <h2>회사 소개</h2>
    <span>대표: ELICE</span>
    <span>주소: 서울 성동구 아차산로17길 48 성수낙낙 2층 엘리스트랩 성수점</span>
  `;
  container.appendChild(company);

  const customerService = document.createElement("div");
  customerService.className = "customer-service";
  customerService.innerHTML = `
    <h2>고객 센터</h2>
    <span>1234 - 5678</span>
    <span>09:00 - 18:00 (토,일 공휴일 휴무)</span>
    <span>LUNCH 12:00 - 13:30</span>
  `;

  box.appendChild(customerService);
  footer.appendChild(box);
}

export default createFooter;
