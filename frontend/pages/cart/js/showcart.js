import remove from "./removebutton.js";
import showTotalPrice from "./showtotalprice.js";

function showCart(cart) {
  const productContainer = document.querySelector(".product-container");
  let totalPrice = 0;
  let totalDiscount = 0;

  cart.forEach((product, index) => {
    let count = 1;

    const div = document.createElement("div");
    div.className = "product-list";
    const uniqueId = `${product.id}_${product.selectedColor}_${product.selectedSize}_${index}`;

    div.innerHTML = `
          <img class='product-img' src= "${product.imgUrl}" alt= "${
      product.name
    }">
          <div class='product-information'>
            <p class='product-name'>${product.name}</p>
            <p class='product-option'>${product.selectedColor} / ${
      product.selectedSize
    }</p>
          </div>
          <div class='product-count'>
                <button class="decrease">-</button>
                <span class="count">${count}</span>
                <button class="increase">+</button>
          </div>
          <p class='product-price'>${product.price.toLocaleString()}won</p>
          <button data-id='${uniqueId}' class='list-remove'>삭제</button> 
      `;

    productContainer.appendChild(div);

    totalPrice += product.price;
    totalDiscount += (product.price * product.discountRate) / 100;

    // 수량 조절 버튼에 이벤트 리스너 추가
    div.querySelector(".increase").addEventListener("click", function (e) {
      e.preventDefault();
      count += 1;
      div.querySelector(".product-count .count").textContent = count;
      totalPrice += product.price;
      totalDiscount += (product.price * product.discountRate) / 100;

      showTotalPrice(totalPrice, totalDiscount);
    });
    div.querySelector(".decrease").addEventListener("click", function (e) {
      e.preventDefault();
      if (count > 1) {
        count -= 1;
        div.querySelector(".product-count .count").textContent = count;
        totalPrice -= product.price;
        totalDiscount -= (product.price * product.discountRate) / 100;

        showTotalPrice(totalPrice, totalDiscount);
      }
    });
  });

  remove(cart);
  showTotalPrice(totalPrice, totalDiscount);
}

export default showCart;
