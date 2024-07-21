function remove(cart) {
  //선택 삭제
  document.querySelectorAll(".list-remove").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const removeId = e.target.dataset.id;
      const newCart = cart.filter((product, index) => {
        const uniqueId = `${product.id}_${product.selectedColor}_${product.selectedSize}_${index}`;
        return uniqueId !== removeId;
      });

      localStorage.setItem("cart", JSON.stringify(newCart));
    });
  });

  //전체 삭제
  document.querySelector(".list-remove-all").addEventListener("click", () => {
    localStorage.setItem("cart", JSON.stringify([]));
  });
}
export default remove;
