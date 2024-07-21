const findProducts = async () => {
  try {
    const res = await fetch(
      "http://kdt-sw-8-team02.elicecoding.com/api/v1/products",
      {
        method: "GET",
      }
    );
    if (res.ok) {
      const data = await res.json();
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
