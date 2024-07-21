import URL from "../common/data/url.js";

const reOrder = async (orderData, newTotalPrice) => {
  const data = {
    products: orderData.products,
    totalPrice: newTotalPrice,
    deliverStatus: false,
    customer: orderData.customer,
    delivery: orderData.delivery,
  };
  const token = localStorage.getItem("token");
  console.log(orderData.orderNumber);
  try {
    const response = await fetch(
      `http://kdt-sw-8-team02.elicecoding.com/api/v1/orders/${orderData.orderNumber}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...data }),
      }
    );

    if (response.ok) {
      localStorage.removeItem("order");
      localStorage.removeItem("products");

      alert("주문 수정이 완료 되었습니다.");
      alert("관리자 승인까지 기다려주세요.");

      window.location.href = URL.MY_PAGE_URL;
    } else {
      throw new Error("실패");
    }
  } catch (error) {
    alert("수정 실패 했습니다. 다시 시도해주세요");
  }
};

export default reOrder;
