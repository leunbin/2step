import { TILTE_TEXT } from "../data/data.js";
import PRODUCT_DATA from "../../common/data/productdata.js";
import CreateList from "./createlist.js";
import CreateTitle from "./createtitle.js";

// 상품 분류
const products1 = [];
const products2 = [];
const products3 = [];

for (const product of PRODUCT_DATA.data) {
  if (product.state === "NEW") {
    products1.push(product);
  }
  if (product.state === "BEST") {
    products2.push(product);
  }
  if (product.state === "SALE") {
    products3.push(product);
  }
}

//상품 표시
for (let id = 1; id <= TILTE_TEXT.length; id++) {
  let productData = [];
  if (id === 1) {
    productData = products1.slice(0, 4);
  }
  if (id === 2) {
    productData = products2.slice(0, 4);
  }
  if (id === 3) {
    productData = products3.slice(0, 4);
  }
  const titleTextData = TILTE_TEXT[id - 1];
  CreateList(productData, id);
  CreateTitle(titleTextData, id);
}
