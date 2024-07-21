function showTotalPrice(totalPrice, totalDiscount) {
  const query = [".total-price", ".total-discount", ".total-payment"];

  query.forEach((el) => {
    const priceEl = document.querySelector(`${el} .payment-price`);

    if (el === ".total-price") {
      priceEl.innerHTML = `${totalPrice}원`;
    }
    if (el === ".total-discount") {
      priceEl.innerHTML = `${totalDiscount}원`;
    }
    if (el === ".total-payment") {
      priceEl.innerHTML = `${totalPrice - totalDiscount}원`;
    }
  });
}

export default showTotalPrice;
