import URL from "../../common/data/url";
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

function createProductSection(product) {
  const priceClassName =
    product.discountRate > 0 ? "product-price" : "nodiscount-product-price";
  return `
    <div class="put-product">
      <a href=${URL.PRODUCT_DETAIL_PAGE_URL}?productId=${product._id}>
        <img src=${product.imgUrl} alt="신발 예시" />
        <button class="button">담기</button>
      </a>
    </div>
    <div class="put-product-information">
      <p class='product-name'>${product.name}</p>
      <p class='product-category'>${product.category}</p>
      <p class='${priceClassName}'>${
    product.price.toLocaleString() + " won"
  }</p>
      ${createDiscountSection(product)}
    </div>`;
}

function CreateList(products, id) {
  const productList = document.querySelector(
    `#productBanner${id} .popular-product ul`
  );

  products.forEach((product) => {
    const li = document.createElement("li");
    li.innerHTML = createProductSection(product);
    productList.appendChild(li);
  });
}

export default CreateList;
