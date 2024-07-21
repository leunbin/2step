import URL from "../../common/data/url";

function CreateTitle(titleData, id) {
  const popularText = document.querySelector(
    `#productBanner${id} .popular-text`
  );

  const title = document.createElement("p");
  const subTitle = document.createElement("p");

  title.classList.add("title-class");
  subTitle.classList.add("subtitle-class");

  title.innerHTML = `<a href = ${URL.PRODUCT_LIST_PAGE_URL}?category=${titleData.state}>${titleData.title}<a/>`;
  subTitle.innerHTML = `${titleData.subTitle}`;

  popularText.appendChild(title);
  popularText.appendChild(subTitle);
}

export default CreateTitle;
