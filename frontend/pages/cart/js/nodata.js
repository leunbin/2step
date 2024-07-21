function noDataText() {
  const container = document.querySelector("main");
  const img = document.createElement("img");
  img.className = "noData";
  img.src = "텅.png";
  img.alt = "no data 사진";

  container.appendChild(img);
}

export default noDataText;
