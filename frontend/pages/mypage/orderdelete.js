const orderDelete = async (orderNumber) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `http://localhost:3000/api/v1/orders/${orderNumber}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.ok) {
      alert("주문이 취소 되었습니다.");
      window.location.reload();
    } else {
      throw new Error("API 에러");
    }
  } catch (e) {
    console.error(e);
  }
};

export default orderDelete;
