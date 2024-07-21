import reOrder from "./reorder";

function showOrderEditPage(orderData, productData, deliverStatus) {
  const productListHtml = productData
    .map(
      (product) => `
    <div class="order-item" data-product-id="${product._id}">
        <div class="image-group">
            <img src="${product.imgUrl}" alt="Product ${product._id}">
        </div>
        <div class="details-group">
            <h3>${product.name}</h3>
            <p>${product.price.toLocaleString()}원</p>
            <p class="delivery-status">${deliverStatus}</p>
        </div>
        <div class="order-button-group">
            <button class="adjust-quantity decrease">-</button>
            <input type="number" class="quantity-input" value="1" min="1">
            <button class="adjust-quantity increase">+</button>
        </div>
    </div>
  `
    )
    .join("");

  const mainContent = document.querySelector(".main-content");
  mainContent.innerHTML = `
    <div class="page-title">주문 정보 수정</div>
    <div class="separator"></div>
    <div class="order-edit-form">
        <div class="horizontal-line"></div>
        <!-- 상품 목록 부분 -->
        <div class="product-list">${productListHtml}</div>
        <!-- 구매자 정보 부분 -->
        <div class="section-title">구매자 정보</div>
        <div class="separator"></div>
        <div class="buyer-info">
            <p>주문자 : ${orderData.customer.name}</p>
            <p>연락처 : ${orderData.customer.phone}</p>
            <p>이메일 : ${orderData.customer.email}</p>
        </div>
        <!-- 배송지 정보 부분 -->
        <div class="section-title">배송지 정보</div>
        <div class="separator"></div>
        <div class="shipping-info">
            <p>수령인 : ${orderData.delivery.name}</p>
            <p>연락처 : ${orderData.delivery.phone}</p>
            <p>배송지 : ${orderData.delivery.address}</p>
        </div>
        <!-- 금액 정보 부분 -->
        <div class="section-title">결제 정보</div>
        <div class="separator"></div>
        <div class="pay-info">
            <p>총 주문금액 : ${orderData.totalPrice.toLocaleString()}원</p>
        </div>
        <!-- 수정 요청 버튼 -->
        <button type="button" class="edit-button">수정 요청</button>
    </div>
  `;

  mainContent.addEventListener("click", function (event) {
    if (event.target.classList.contains("increase")) {
      const quantityInput = event.target
        .closest(".order-item")
        .querySelector(".quantity-input");
      quantityInput.value = Number(quantityInput.value) + 1;
    } else if (event.target.classList.contains("decrease")) {
      const quantityInput = event.target
        .closest(".order-item")
        .querySelector(".quantity-input");
      quantityInput.value = Math.max(1, Number(quantityInput.value) - 1);
    }
  });

  const editButton = document.querySelector(".edit-button");
  editButton.addEventListener("click", function (event) {
    event.preventDefault();

    const quantityInputs = document.querySelectorAll(".quantity-input");
    const quantities = Array.from(quantityInputs).map((input) =>
      Number(input.value)
    );

    let newTotalPrice = 0;
    for (let i = 0; i < productData.length; i++) {
      newTotalPrice +=
        productData[i].price *
        (1 - productData[i].discountRate / 100) *
        quantities[i];
    }

    reOrder(orderData, newTotalPrice);
  });
}

export default showOrderEditPage;
