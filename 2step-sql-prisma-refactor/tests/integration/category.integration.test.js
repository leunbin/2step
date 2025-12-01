const request = require('supertest');
const { insertCategory } = require('../fixtures/category.fixture');

let app;

beforeAll(() => {
  app = global.__APP__;
})

describe('GET /api/categories', () => {
  beforeEach(async() => {
    await insertCategory();

    await insertCategory({
      name: 'Heels',
      code: "HEL-002",
      isActive: true,
    });

    await insertCategory({
      name: 'Running',
      code: "RUN-003",
      isActive: true
    });
  })

  test('전체 카테고리 조회 성공', async() => {
    const res = await request(app)
      .get('/api/categories')
      .expect(201)
    
    res.body.data.forEach((item) => {
      expect(item).toHaveProperty('id');
    })
  })
})

describe('GET /api/categories/:categoryId', () => {
  let categoryId;

  beforeEach(async() => {
    const category = await insertCategory();
    categoryId = category.id;

    await insertCategory({
      name: 'Heels',
      code: "HEL-002",
      isActive: true,
    });

    await insertCategory({
      name: 'Running',
      code: "RUN-003",
      isActive: true
    });
  })

  test('댠일 카테고리 조회 성공', async() => {
    const res = await request(app)
      .get(`/api/categories/${categoryId}`)
      .expect(201)

    expect(res.body.data.id).toBe(categoryId);
  })

  test('단일 카테고리 조회 실패', async() => {
    const res = await request(app)
      .get(`/api/categories/9999`)
      .expect(404)

    expect(res.body.error.message).toBe('해당 카테고리가 없습니다.');
  })
})