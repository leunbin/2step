import PRODUCT_DATA from "../../../common/data/productdata.js";
import cartCreate from "./cartcreate.js";
import createOption from "./createoption.js";

loadProductDetailPage();

function loadProductDetailPage() {
  const productId = new URLSearchParams(window.location.search).get(
    "productId"
  );

  const selectedProduct = PRODUCT_DATA.data.find(
    (product) => product._id === productId
  );

  document.title = selectedProduct.name;
  productShow(selectedProduct);
}

function createDiscountSection(product) {
  if (product.discountRate > 0) {
    const discountPrice = Math.floor(
      product.price * (1 - product.discountRate / 100)
    );
    return `
      <div>
        <span class='product-discount'>${product.discountRate + "%"}</span>
        <span class='product-discountPrice'>${
          discountPrice.toLocaleString() + " won"
        }</span>
      </div>`;
  }
  return "";
}

function productShow(product) {
  const productContainer = document.querySelector(".product-container");

  const div = document.createElement("div");
  div.classList.add("product-show");

  const priceClassName =
    product.discountRate > 0 ? "product-price" : "nodiscount-product-price";

  div.innerHTML = `
      <div class = image-container>
        <img src="${product.imgUrl}" alt="신발 예시" />
        
      </div>
      <div class="product-information">
        <p class='product-name'>${product.name}</p>
        <p class='product-category'>${product.category}</p>
        <p class='${priceClassName}'>${
    product.price.toLocaleString() + " won"
  }</p>
        ${createDiscountSection(product)}
        <p class='product-company'>제조사: ${product.company}</p>
        
        <div class="product-options">
          <form>
            <div class="select is-small">
              <select class='color-option'>
                <option selected disabled>Color</option>
              </select>
            </div>

           <div class="select is-small">
              <select class='size-option'>
                <option selected disabled>Size</option>
              </select>
            </div>
          </form>
          <div class="botton-container">
            <button class="cart-button">장바구니</button>
            <button class="purchase-button">구매하기</button>
          </div>  
        </div>

      </div>
    `;

  productContainer.appendChild(div);

  createOption(div, product);

  cartCreate(div, product);
}
