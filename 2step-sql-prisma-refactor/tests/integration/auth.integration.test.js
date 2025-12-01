const request = require("supertest");
const { insertUser } = require("../fixtures/user.fixture");

let app;
beforeAll(() => {
  app = global.__APP__;
})

describe('POST /api/auth/register', () => {
  beforeEach(async() => {
    await insertUser();
  })

  test("정상 회원가입", async() => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        email: "eunjin@gmail.com",
        password: "123123",
        firstName: "Lee",
        lastName: "eunjin",
        isAdmin: false,
        address: {
          street: "서울 자양로",
          detailedAddress: "101동 102호",
          postalCode: "12345"
        },
      })
      .expect(201)
      
    expect(res.body.data.user.email).toBe('eunjin@gmail.com');
    expect(res.body.data.user).toHaveProperty("id");
  })

  test('존재하는 이메일로 회원가입 시도', async() => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        email: "fixture@test.com",
        password: "123123",
        firstName: "Lee",
        lastName: "eunjin",
        isAdmin: false,
        address: {
          street: "서울 자양로",
          detailedAddress: "101동 102호",
          postalCode: "12345"
        },
      })
      .expect(400);

    expect(res.body.error.success).toBe(false);
    expect(res.body.error.message).toBe('이미 존재하는 이메일입니다.');
  })
})

describe('POST /api/auth/login', () => {
  beforeEach(async() => {
    const email = "login@test.com";
    await insertUser({ email });
  })

  test("정상 로그인", async() => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: "login@test.com",
        password: "password1234!",
      })
      .expect(201);
    
    expect(res.body.data).toHaveProperty("token");
  })
})

describe('POST /api/auth/withdraw', () => {
  let agent;
  let token;

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
        password:"password1234!"
      })

    token = result.body.data.token;
  })
  test("정상 탈퇴", async() => {
    const res = await request(app)
      .post("/api/auth/withdraw")
      .set("Authorization", `Bearer ${token}`)
      .expect(201);

    expect(res.body.data).toBe(true);
  })

  test("권한 없이 탈퇴 요청", async() => {
    const res = await request(app)
      .post("/api/auth/withdraw")
      .expect(401);

    expect(res.body.error.message).toBe('권한이 없거나 인증되지 않은 유저입니다.')
  })
})