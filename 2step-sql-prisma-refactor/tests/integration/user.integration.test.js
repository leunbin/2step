const request = require("supertest");
const { insertUser } = require("../fixtures/user.fixture");

let app;

beforeAll(() => {
  app = global.__APP__;
})

describe('GET /api/me', () => {
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
        password: "password1234!",
      })

    token = result.body.data.token;
  })

  test("회원 정보 요청",async() => {
    const res = await request(app)
      .get("/api/me")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)

    expect(res.body.data.email).toBe("login@test.com");
  })

  test("권한 없이 정보 요청", async() => {
    const res = await request(app)
      .get("/api/me")
      .expect(401)
    
    expect(res.body.error.message).toBe("권한이 없거나 인증되지 않은 유저입니다.");
  })

  test("회원 정보 수정 요청", async() => {
    const res = await request(app)
      .put("/api/me")
      .set("Authorization", `Bearer ${token}`)
      .send({
        address:{
          street: "창원시 창이대로 880번길"
        }
      })
      .expect(200)
    
    expect(res.body.data.email).toBe("login@test.com");
    expect(res.body.data.address.street).toBe("창원시 창이대로 880번길");
  })
  
  test("권한 없이 수정 요청", async() => {
    const res = await request(app)
      .put("/api/me")
      .send({
        address:{
          street: "창원시 창이대로 880번길"
        }
      })
      .expect(401)

      expect(res.body.error.message).toBe("권한이 없거나 인증되지 않은 유저입니다.");
  })
})