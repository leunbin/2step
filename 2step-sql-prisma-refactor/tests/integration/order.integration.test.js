const request = require('supertest');
const { insertUser, insertCategory, insertProduct, insertProductOptions, insertOrder, insertOrderitem, insertDelivery, insertCustomer } = require('../fixtures');

let app;

describe('GET /api/orders', () => {
  let agent;
  let token;
  let userId;
  let orderId;

  beforeAll(() => {
    app = global.__APP__;
    agent = request.agent(app);
  })

  beforeEach(async() => {
    const email = "login@test.com";
    await insertUser({ email });

    const result = await agent
      .post("/api/auth/login")
      .send({
        email: "login@test.com",
        password: "password1234!",
      })
    token = result.body.data.token;
    userId = result.body.data.user.id;

    const category = await insertCategory();
    const product = await insertProduct(category.id);
    const options = await insertProductOptions(product.id);
    const order = await insertOrder(userId);
    orderId = order.id;

    await insertOrderitem(order.id, product.id, options.id);
    await insertDelivery(order.id);
    await insertCustomer(order.id);
  })

  test("사용자의 모든 주문 조회", async() => {
    const res = await request(app)
      .get('/api/orders')
      .set("Authorization", `Bearer ${token}`)
      .expect(200)

    res.body.data.forEach((item) => {
      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("orderNumber");
      expect(item.userId).toBe(userId);
    })
  })
  
  test("사용자의 주문 세부 정보 조회", async() => {
    const res = await request(app)
      .get("/api/orders")
      .query({ orderId: orderId})
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

      expect(res.body.data).toHaveProperty("order");
      expect(res.body.data).toHaveProperty("orderItem");
      expect(res.body.data).toHaveProperty("delivery");
      expect(res.body.data).toHaveProperty("customer");
      expect(res.body.data.order.id).toBe(orderId);
  })
})

describe('POST /api/orders', () => {
  let agent;
  let token;
  let product;
  let productId;
  let productOptionId;
  
  beforeAll(() => {
    app = global.__APP__;
    agent = request.agent(app);
  })

  beforeEach(async() => {
    const email = "login@test.com";
    await insertUser({ email });

    const result = await agent
      .post("/api/auth/login")
      .send({
        email: "login@test.com",
        password: "password1234!",
      })
    token = result.body.data.token;

    const category = await insertCategory();
    product = await insertProduct(category.id);
    productId = product.id;
    const options = await insertProductOptions(product.id);
    productOptionId = options.id;
  })

  test("정상 주문 생성", async() => {
    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({
        items: [{
          productId,
          productOptionId,
          quantity: 5
        }],
        delivery: {
          name: "Minju",
          phone: "010-2353-1346",
          postcode: "13454",
          address: "서울특별시 송파구 올림픽로 300 101동 1203호"
        },
        customer:{
          name: "Wonhee",
          phone: "010-3453-2461",
          email: "wonhee@gmail.com"
        }
      })
      .expect(201);

    expect(res.body.data.order).toHaveProperty("id");
    expect(res.body.data.order).toHaveProperty("orderNumber");
    expect(res.body.data).toHaveProperty("customer");
    expect(res.body.data).toHaveProperty("delivery");
    expect(res.body.data.order.totalPrice).toBe(product.price*5*(1-product.discountRate/100));
  }) 
})

describe('PUT /api/orders/:id', () => {
  let agent;
  let token;
  let orderId;
  let product;
  let options;

  beforeAll(() => {
    app =  global.__APP__;
    agent = request.agent(app);
  })

  beforeEach(async() => {
    const email = "login@test.com";
    await insertUser({ email });

    const result = await agent
      .post("/api/auth/login")
      .send({
        email: "login@test.com",
        password: "password1234!",
      })
    token = result.body.data.token;
    
    const category = await insertCategory();
    product = await insertProduct(category.id);
    options = await insertProductOptions(product.id);

    const order = await agent
      .post("/api/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({
        items: [{
          productId: product.id,
          productOptionId: options.id,
          quantity: 5
        }],
        delivery: {
          name: "Minju",
          phone: "010-2353-1346",
          postcode: "13454",
          address: "서울특별시 송파구 올림픽로 300 101동 1203호"
        },
        customer:{
          name: "Wonhee",
          phone: "010-3453-2461",
          email: "wonhee@gmail.com"
        }
      })

    orderId = order.body.data.order.id;
  })

  test("정상 주문 수정", async() => {
    const res = await request(app)
      .put(`/api/orders/${orderId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        items: [{
          productId: product.id,
          productOptionId: options.id,
          quantity: 10
        }],
        delivery: {
          name: "Moka"
        },
        customer: {
          email: "newWonhee@gmail.com"
        }
      })
      .expect(200)

    expect(res.body.data.updatedorder.totalPrice).toBe(product.price*10*(1-product.discountRate/100));
    expect(res.body.data.updatedCustomer.email).toBe("newWonhee@gmail.com");
    expect(res.body.data.updatedDelivery.name).toBe("Moka");
  })

  test("주문 수정 시 재고 부족", async() => {
    const res = await request(app)
      .put(`/api/orders/${orderId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        items: [{
          productId: product.id,
          productOptionId: options.id,
          quantity: 15
        }],
        delivery: {
          name: "Moka"
        },
        customer: {
          email: "newWonhee@gmail.com"
        }
      })
      .expect(404)

    expect(res.body.error.success).toBe(false);
    expect(res.body.error.message).toBe("재고가 부족합니다.");
  })
})

describe("DELETE /api/orders/:id", () => {
  let agent;
  let token;
  let orderId;
  let product;
  let options;

  beforeAll(() => {
    app =  global.__APP__;
    agent = request.agent(app);
  })

  beforeEach(async() => {
    const email = "login@test.com";
    await insertUser({ email });

    const result = await agent
      .post("/api/auth/login")
      .send({
        email: "login@test.com",
        password: "password1234!",
      })
    token = result.body.data.token;
    
    const category = await insertCategory();
    product = await insertProduct(category.id);
    options = await insertProductOptions(product.id);

    const order = await agent
      .post("/api/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({
        items: [{
          productId: product.id,
          productOptionId: options.id,
          quantity: 5
        }],
        delivery: {
          name: "Minju",
          phone: "010-2353-1346",
          postcode: "13454",
          address: "서울특별시 송파구 올림픽로 300 101동 1203호"
        },
        customer:{
          name: "Wonhee",
          phone: "010-3453-2461",
          email: "wonhee@gmail.com"
        }
      })

    orderId = order.body.data.order.id;
  })

  test("정상 주문 취소", async() => {
    const res = await request(app)
      .delete(`/api/orders/${orderId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)

    expect(res.body.data).toBe(true);
  })
})