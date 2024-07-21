import findProduct from "./findproduct";
import orderDelete from "./orderdelete";
import showOrderEditPage from "./ordereditor";
import URL from "../common/data/url.js";

const findOrders = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(
      "http://kdt-sw-8-team02.elicecoding.com/api/v1/orders",
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
      if (data.orders.length > 0) {
        console.log(data.orders[0]);
        const products = findProduct(data.orders[0].products);
        console.log(products);
        localStorage.setItem("order", JSON.stringify(data.orders[0]));
        localStorage.setItem("products", JSON.stringify(products));

        showOrderHistory(data.orders[0], products);
      } else {
        document.querySelector(
          ".main-content"
        ).innerHTML = `<div class="page-title">주문 내역이 존재하지 않습니다.</div>`;
      }
    } else {
      throw new Error("API 에러");
    }
  } catch (e) {
    console.error(e);
  }
};

await findOrders();

document.querySelector("#showOrderHistory").addEventListener("click", () => {
  const order = JSON.parse(localStorage.getItem("order"));
  const products = JSON.parse(localStorage.getItem("products"));

  showOrderHistory(order, products);
});

// 주문 내역 표시 함수
function showOrderHistory(orderData, productData) {
  if (orderData) {
    const deliverStatus = orderData.deliverStatus ? "배송 준비" : "상품 준비";
    document.querySelector(".main-content").innerHTML = `
      <div class="page-title">주문내역</div>
      <div class="separator"></div>
      <div class="order-item">
        <div class="image-group">
          <img src="${productData[0].imgUrl}" alt="주문상품">
        </div>
        <div class="details-group">
          <h3>${productData[0].name} 외 ${productData.length - 1}</h3>
          <p> ${orderData.totalPrice.toLocaleString()}원</p>
          <p class="delivery-status">${deliverStatus}</p>
        </div>
        <div class="button-group">
          <button id = "cancel-order-button" class="order-button">주문 취소</button>
          <button id = "edit-order-button" class="order-button">주문 수정</button>
        </div>
      </div>
    `;

    document
      .querySelector("#cancel-order-button")
      .addEventListener("click", () => {
        if (confirm("상품을 삭제하시겠습니까?")) {
          orderDelete(orderData.orderNumber);
          localStorage.removeItem("order");
          localStorage.removeItem("products");
        }
      });

    // 주문 수정 버튼에 이벤트 리스너 추가
    document
      .querySelector("#edit-order-button")
      .addEventListener("click", function () {
        showOrderEditPage(orderData, productData, deliverStatus);
      });
  } else {
    document.querySelector(
      ".main-content"
    ).innerHTML = `<div class="page-title">주문 내역이 존재하지 않습니다.</div>`;
  }
}

document.querySelector(".title").addEventListener("click", () => {
  location.href = URL.MAIN_PAGE_URL;
});

export default showOrderHistory;
