import PRODUCT_DATA from "../../../common/data/productdata";
import URL from "../../../common/data/url";

const category = new URLSearchParams(window.location.search).get("category");

productListShow(category);

function productListShow(category) {
  showTitle(category);
  productCategory(category);
  productDivide(category);
}

function showTitle(category) {
  document.title = category;
}

function productCategory(category) {
  const categoryText = document.querySelector(".category");
  const title = document.createElement("p");
  title.classList.add("title-class");
  title.innerHTML = `${category}`;
  categoryText.appendChild(title);
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

function createProductSection(product) {
  const priceClassName =
    product.discountRate > 0 ? "product-price" : "nodiscount-product-price";
  return `
    <a href='${URL.PRODUCT_DETAIL_PAGE_URL}?productId=${
    product._id
  }'><img src="${product.imgUrl}" alt="신발 예시" /></a>
    <div class="product-information">
      <p class='product-name'>${product.name}</p>
      <p class='product-category'>${product.category}</p>
      <p class='${priceClassName}'>${
    product.price.toLocaleString() + " won"
  }</p>
      ${createDiscountSection(product)}
    </div>`;
}

function productDivide(category) {
  const productList = document.querySelector(".product ul");

  PRODUCT_DATA.data.forEach((product) => {
    if (product.category === category || product.state === category) {
      const li = document.createElement("li");
      li.innerHTML = createProductSection(product);
      productList.appendChild(li);
    }
  });
}
