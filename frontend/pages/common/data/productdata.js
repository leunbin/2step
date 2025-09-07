const findProducts = async () => {
  try {
    const res = await fetch(
      "http://localhost:3000/api/v1/products",
      {
        method: "GET",
      }
    );
    if (res.ok) {
      const data = await res.json();
      console.log(data)
      return data;
    } else {
      console.error(res.status, res.statusText, res.statusCode);
    }
  } catch (e) {
    console.error(e);
  }
};

const PRODUCT_DATA = await findProducts();

export default PRODUCT_DATA;
