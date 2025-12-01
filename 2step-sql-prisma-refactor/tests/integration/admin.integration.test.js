const request = require("supertest");
const { insertUser } = require("../fixtures/user.fixture");
const { insertProduct, insertCategory, insertProductOptions, insertOrder, insertOrderitem, insertDelivery, insertCustomer } = require("../fixtures");
const { category } = require("../../src/prismaClient");

let app;

describe('POST /api/admin/category', () => {
  let agent;
  let token;

  beforeAll(() => {
    app = global.__APP__;
    agent = request.agent(app);
  })

  beforeEach(async() => {
    const email = "login@test.com";

    await insertUser({
      email,
      isAdmin: true,
    });

    const result = await agent
      .post("/api/auth/login")
      .send({
        email: "login@test.com",
        password: "password1234!",
      })
    token = result.body.data.token;
  })

  test("관리자 권한으로 카테고리 정상 생성", async() => {
    const res = await request(app)
      .post("/api/admin/category")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Heels",
        code: "HEL-003",
      })

    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data).toHaveProperty("order");
  })
})

describe('PUT /api/admin/category/order', () => {
  let agent;
  let token;
  let sneakersId;
  let heelsId;
  let runningId;

  beforeAll(() => {
    app = global.__APP__;
    agent = request.agent(app);
  })

  beforeEach(async() => {
    const email = "login@test.com";
    await insertUser({
      email,
      isAdmin: true,
    });

    const result = await agent
      .post("/api/auth/login")
      .send({
        email: "login@test.com",
        password: "password1234!",
      })
    token = result.body.data.token;

    const sneakers = await agent
      .post("/api/admin/category")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Sneakers",
        code: "SNK-001",
      })
    sneakersId = sneakers.body.data.id;

    const heels = await agent
      .post("/api/admin/category")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Heels",
        code: "HEL-002",
      })
    heelsId = heels.body.data.id;

    const running = await agent
      .post("/api/admin/category")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Running",
        code: "RUN-003",
    })
    runningId = running.body.data.id;
  })

  test("순서 정상 수정", async() => {
    const res = await request(app)
      .put('/api/admin/category/order')
      .set("Authorization", `Bearer ${token}`)
      .send([
        { id: sneakersId, order: 3 },
        { id: heelsId, order: 1 }
      ])
      .expect(201)

    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(3);
    res.body.data.forEach(item => {
      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("name");
      expect(item).toHaveProperty("order");
    });
  })
})

describe('PUT /api/admin/category/merge/targetId?', () => {
  let agent;
  let token;
  let sneakersId;
  let heelsId;
  let runningId;

  beforeAll(() => {
    app = global.__APP__;
    agent = request.agent(app);
  })

  beforeEach(async() => {
    const email = "login@test.com";
    await insertUser({
      email,
      isAdmin: true,
    });

    const result = await agent
      .post("/api/auth/login")
      .send({
        email: "login@test.com",
        password: "password1234!",
      })
    token = result.body.data.token;

    const sneakers = await agent
      .post("/api/admin/category")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Sneakers",
        code: "SNK-001",
      })
    sneakersId = sneakers.body.data.id;

    const heels = await agent
      .post("/api/admin/category")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Heels",
        code: "HEL-002",
      })
    heelsId = heels.body.data.id;

    const running = await agent
      .post("/api/admin/category")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Running",
        code: "RUN-003",
    })
    runningId = running.body.data.id;

    await insertProduct(sneakersId);

    await insertProduct(heelsId, {
      name: "Heels shoes",
      productCode: "HEL-AF-2",
    });
    await insertProduct(runningId, {
      name: "NewBalance",
      productCode : "NB-AK-02",
    })
  })

  test("카테고리 정상 합병", async() => {
    const res = await request(app)
      .put('/api/admin/category/merge')
      .query({ targetId: heelsId })
      .set("Authorization", `Bearer ${token}`)
      .send([
        {id: sneakersId, name: "Sneakers"},
        {id: runningId, name: "Running"},
      ])
      .expect(201)

    expect(res.body.data.newProducts.length).toBe(3);

    res.body.data.newProducts.forEach((item) => {
      expect(item.categoryId).toBe(heelsId);
    })

    res.body.data.targetedCategory.forEach((item) => {
      expect(item.isActive).toBe(false);
    })
  })
})

describe('POST /api/admin/product', () => {
  let agent;
  let token;
  let sneakersId;

  beforeAll(() => {
    app = global.__APP__;
    agent = request.agent(app);
  })

  beforeEach(async() => {
    const email = "login@test.com";

    await insertUser({
      email,
      isAdmin: true,
    });

    const result = await agent
      .post("/api/auth/login")
      .send({
        email: "login@test.com",
        password: "password1234!",
      })
    token = result.body.data.token;

    const sneakers = await agent
      .post("/api/admin/category")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Sneakers",
        code: "SNK-001",
      })
    sneakersId = sneakers.body.data.id;
  })

  test("새로운 상품 정상 생성", async() => {
    const res = await request(app)
      .post('/api/admin/product')
      .set("Authorization", `Bearer ${token}`)
      .send({
        product:{
          name: "Adidas Superstar",
          price: 119000,
          discountRate: 15,
          productCode: "AD-SS-01",
          description: "클래식한 셸토 디자인의 아디다스 슈퍼스타.",
          company: "Adidas",
          imgUrl: "https://example.com/img/adidas_superstar.png",
          categoryId: sneakersId
        },
        options:[
          {
            size: "230", 
            color: "white", 
            stock: 10,
          }
        ]
      })
      .expect(201);

    expect(res.body.data).toHaveProperty("id");
  })
})

describe('PUT /api/admin/category/:category', () => {
  let agent;
  let token;
  let categoryId;

  beforeAll(() => {
    app = global.__APP__;
    agent = request.agent(app);
  })

  beforeEach(async() => {
    const email = "login@test.com";

    await insertUser({
      email,
      isAdmin: true,
    });

    const result = await agent
      .post("/api/auth/login")
      .send({
        email: "login@test.com",
        password: "password1234!",
      })
    token = result.body.data.token;

    const category= await agent
      .post("/api/admin/category")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Sneakers",
        code: "SNK-001",
      })
    categoryId = category.body.data.id;
  })
  test('정상 카테고리 수정', async() => {
    const res = await request(app)
      .put(`/api/admin/category/${categoryId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name:"Sneakers",
        code: "NEW-001"
      })
      .expect(201);

    expect(res.body.data.code).toBe("NEW-001");
  })
})

describe('PUT /api/admin/category/active/:categoryId',() => {
  let agent;
  let token;
  let categoryId;

  beforeAll(() => {
    app = global.__APP__;
    agent = request.agent(app);
  })

  beforeEach(async() => {
    const email = "login@test.com";

    await insertUser({
      email,
      isAdmin: true,
    });

    const result = await agent
      .post("/api/auth/login")
      .send({
        email: "login@test.com",
        password: "password1234!",
      })
    token = result.body.data.token;

    const category= await agent
      .post("/api/admin/category")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Sneakers",
        code: "SNK-001",
      })
    categoryId = category.body.data.id;
  })

  test('정상 카테고리 활성화 수정', async() => {
    const res = await request(app)
      .put(`/api/admin/category/active/${categoryId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(201)

    expect(res.body.data.id).toBe(categoryId);
    expect(res.body.data.isActive).toBe(false);
  })
})

describe('DELETE /api/admin/product/:productId',() => {
  let agent;
  let token;
  let sneakersId;
  let productId;

  beforeAll(() => {
    app = global.__APP__;
    agent = request.agent(app);
  })

  beforeEach(async() => {
    const email = "login@test.com";

    await insertUser({
      email,
      isAdmin: true,
    });

    const result = await agent
      .post("/api/auth/login")
      .send({
        email: "login@test.com",
        password: "password1234!",
      })
    token = result.body.data.token;

    const sneakers = await agent
      .post("/api/admin/category")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Sneakers",
        code: "SNK-001",
      })
    sneakersId = sneakers.body.data.id;

    const product = await agent
      .post('/api/admin/product')
      .set("Authorization", `Bearer ${token}`)
      .send({
        product:{
          name: "Adidas Superstar",
          price: 119000,
          discountRate: 15,
          productCode: "AD-SS-01",
          description: "클래식한 셸토 디자인의 아디다스 슈퍼스타.",
          company: "Adidas",
          imgUrl: "https://example.com/img/adidas_superstar.png",
          categoryId: sneakersId
        },
        options:[
          {
            size: "230", 
            color: "white", 
            stock: 10,
          }
        ]
      })
    productId = product.body.data.id;
  })
  test('상품 정상 삭제', async() =>{
    const res = await request(app)
      .delete(`/api/admin/product/${productId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(201)
    
    expect(res.body.data).toBe(true);
  })
})

describe('PUT /api/admin/category/soft-delete/:categoryId',() => {
  let agent;
  let token;
  let sneakersId;
  let heelsId;
  let runningId;

  beforeAll(() => {
    app = global.__APP__;
    agent = request.agent(app);
  })

  beforeEach(async() => {
    const email = "login@test.com";
    await insertUser({
      email,
      isAdmin: true,
    });

    const result = await agent
      .post("/api/auth/login")
      .send({
        email: "login@test.com",
        password: "password1234!",
      })
    token = result.body.data.token;

    const sneakers = await agent
      .post("/api/admin/category")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Sneakers",
        code: "SNK-001",
      })
    sneakersId = sneakers.body.data.id;

    const heels = await agent
      .post("/api/admin/category")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Heels",
        code: "HEL-002",
      })
    heelsId = heels.body.data.id;

    const running = await agent
      .post("/api/admin/category")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Running",
        code: "RUN-003",
    })
    runningId = running.body.data.id;

    await insertProduct(sneakersId);

    await insertProduct(heelsId, {
      name: "Heels shoes",
      productCode: "HEL-AF-2",
    });
    await insertProduct(runningId, {
      name: "NewBalance",
      productCode : "NB-AK-02",
    })
  })
  test('카테고리 정상 삭제 및 MOVE_TO_CATEGORY 모드로 전환', async() => {
    const res = await request(app)
      .put(`/api/admin/category/soft-delete/${sneakersId}`)
      .query({mode: 'MOVE_TO_CATEGORY', targetId: heelsId})
      .set("Authorization", `Bearer ${token}`)

    expect(res.body.data).toBe(true);
  })

  test('카테고리 정상 삭제 및 DISCONTINUE_PRODUCTS 모드로 상품 전환', async() => {
    const res = await request(app)
      .put(`/api/admin/category/soft-delete/${sneakersId}`)
      .query({mode: 'DISCONTINUE_PRODUCTS'})
      .set("Authorization", `Bearer ${token}`)

    expect(res.body.data).toBe(true);
  })
})

describe('PUT /api/admin/order/:orderId', () => {
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
    await insertUser({
      email,
      isAdmin: true,
    });

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
  test("관리자 권한으로 주문 상태 정상 수정", async() => {
    const res = await request(app)
      .put(`/api/admin/order/${orderId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        order:{
          status: "SHIPPING"
        }
      })
      .expect(200)
    expect(res.body.data.order.status).toBe("SHIPPING");
    expect(res.body.data.order.id).toBe(orderId);
  })
})

describe('DELETE /api/admin/order/:orderId',() => {
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
    await insertUser({
      email,
      isAdmin: true,
    });

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
    const order = await insertOrder(userId, { status: "SHIPPING" });
    orderId = order.id;

    await insertOrderitem(order.id, product.id, options.id);
    await insertDelivery(order.id);
    await insertCustomer(order.id);
  })

  test('관리자 권한으로 주문 정상 삭제', async() => {
    const res = await request(app)
      .delete(`/api/admin/order/${orderId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      
    expect(res.body.data).toBe(true);
  })
})