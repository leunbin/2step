function createOption(el, product) {
  const sizeOption = el.querySelector(".product-options .size-option");
  const colorOption = el.querySelector(".product-options .color-option");

  const productSize = product.size.split(",");
  const productColor = product.color.split(",");

  productSize.forEach((size) => {
    const option = document.createElement("option");
    option.value = size;
    option.innerHTML = `${size}`;
    sizeOption.appendChild(option);
  });

  productColor.forEach((color) => {
    const option = document.createElement("option");
    option.value = color;
    option.innerHTML = `${color}`;
    colorOption.appendChild(option);
  });
}
export default createOption;
