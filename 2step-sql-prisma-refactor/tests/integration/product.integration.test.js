const request = require("supertest");
const { insertProduct } = require("../fixtures/product.fixture");
const { insertCategory } = require("../fixtures/category.fixture");

let app;

beforeAll(() => {
  app = global.__APP__;
})

describe('GET /api/products', () => {
  beforeEach(async() => {
    const category = await insertCategory();

    await insertProduct(category.id, {
      productCode: "NK-AF-1",
      name: "Air Force White",
    });

    await insertProduct(category.id, {
      productCode: "NK-AF-2",
      name: "Air Force Black",
    });

    await insertProduct(category.id, {
      productCode: "NK-AF-3",
      name: "Air Force Red",
    });
  })

  test('전체 상품 조회 성공', async() => {
    const res = await request(app)
      .get('/api/products')
      .expect(201)

    res.body.data.forEach((item)=>{
      expect(item).toHaveProperty("id");
    })
  })
})

describe('GET /api/products/:productId',() => {
  let productId;
  
  beforeEach(async() => {
    const category = await insertCategory();
    const product = await insertProduct(category.id);
    productId = product.id;
  })

  test('상품 상세 조회 성공', async() => {
    console.time('with-index')
    const res = await request(app)
      .get(`/api/products/${productId}`)
      .expect(201)
    console.timeEnd('with-index')

    expect(res.body.data.id).toBe(productId);
  })

  test('상품 상세 조회 실패', async() => {
    const res = await request(app)
      .get(`/api/products/9999`)
      .expect(404)
    
    expect(res.body.error.message).toBe('해당 상품이 없습니다.');
  })
})

describe('GET /api/products/category/:categoryId', () => {
  let categoryId;
  
  beforeEach(async() => {
    const category = await insertCategory();
    categoryId = category.id;

    await insertProduct(categoryId);
    await insertProduct(categoryId,{
      name: "new product",
      productCode: "new-code"
    })
    await insertProduct(categoryId,{
      name: "new product2",
      productCode: "new-code2"
    })
    await insertProduct(categoryId, {
      name: "new product3",
      productCode: "new-code3"
    })
  })

  test('카테고리로 상품 조회 성공', async() => {
    console.time("no-index");
    const res = await request(app)
      .get(`/api/products/category/${categoryId}`)
      .expect(201)

    console.timeEnd("no-index")
    
    res.body.data.forEach((item) => {
      expect(item.categoryId).toBe(categoryId)
    })
  })
})