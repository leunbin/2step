import URL from "../../../common/data/url";

function cartCreate(el, product) {
  const cartButton = el.querySelector(".cart-button");
  const purchaseButton = el.querySelector(".purchase-button");
  cartButton.addEventListener("click", () => {
    if (addCart(el, product)) {
      alert("장바구니에 상품이 추가되었습니다.");
    }
  });
  purchaseButton.addEventListener("click", () => {
    if (addCart(el, product)) {
      alert("장바구니에 상품이 추가되었습니다.");
      window.location.href = URL.CART_URL;
    }
  });
}

function addCart(el, product) {
  const selectedColor = el.querySelector(".select:first-child select").value;
  const selectedSize = el.querySelector(".select:last-child select").value;

  if (selectedColor === "Color" || selectedSize === "Size") {
    return false;
  }

  const cartItem = {
    ...product,
    selectedColor,
    selectedSize,
  };

  const cart = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [];
  cart.push(cartItem);

  localStorage.setItem("cart", JSON.stringify(cart));
  return true;
}

export default cartCreate;
