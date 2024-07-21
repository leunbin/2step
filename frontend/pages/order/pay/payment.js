// 결제 수단 선택
calculateTotalPrice();

// 총 상품 금액 계산 함수
function calculateTotalPrice() {
  const totalPriceElement = document.querySelector(".total-price"); // 총 상품 금액을 표시할 요소
  const totalPrice = localStorage.getItem("totalPrice")
    ? JSON.parse(localStorage.getItem("totalPrice"))
    : 0;

  totalPriceElement.textContent = totalPrice + "원"; // 총 상품 금액을 표시
}
