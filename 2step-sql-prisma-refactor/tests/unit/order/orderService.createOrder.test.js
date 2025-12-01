const { productOptionDAO } = require("../../../src/data-access");
const commonErrors = require("../../../src/misc/commonErrors");
const orderService = require("../../../src/service/orderService");
const productService = require("../../../src/service/productService");
const { clearDatabase, prisma } = require("../../utils/testUtils")

let productone_id;
let producttwo_id;
let user;

let optionone_ids = [];
let optiontow_ids = [];

describe("orderService.createOrder", () => {
  beforeEach(async () => {
    await clearDatabase();

    productone_id = undefined;
    producttwo_id = undefined;
    user = undefined;

    optionone_ids = [];
    optiontow_ids = [];

    await prisma.category.createMany({
      data: [
        {id: 1, name: 'SNEAKERS'}
      ]
    })

    user = await prisma.user.create({
      data: {
        email: "test@test.com",
        password: "password1234!",
        firstName: "Minsu",
        lastName: "Kim",
      }
    })

    const product1 = {
      productCode: "TEST-1",
      name: "TEST1-NAME",
      price: 129000,
      discountRate: 10,
      description: "TEST1-DESCRIPTOIN",
      company: "CAMPANY",
      imgUrl: "https://example.com/img/airforce1.png",
      categoryId: 1,
    };

    const product2 = {
      productCode: "TEST-2",
      name: "TEST2-NAME",
      price: 200000,
      discountRate: 50,
      description: "TEST2-DESCRIPTOIN",
      company: "CAMPANY",
      imgUrl: "https://example.com/img/airforce1.png",
      categoryId: 1,
    }

    const productOption1 = [
      { size: "230", color: "white", stock: 10 },
      { size: "240", color: "white", stock: 8 },
      { size: "250", color: "white", stock: 12 }
    ];

    const productOption2 = [
      { size: "230", color: "balck", stock: 5 },
      { size: "240", color: "black", stock: 5 },
      { size: "250", color: "black", stock: 5 }
    ]

    productone_id = (await productService.create(product1, productOption1)).id;
    producttwo_id = (await productService.create(product2, productOption2)).id;

    const option1 = await productOptionDAO.findByProductId(prisma, productone_id);
    const option2 = await productOptionDAO.findByProductId(prisma, producttwo_id);

    option1.forEach((opt) => {
      optionone_ids.push(opt.id);
    });

    option2.forEach((opt) => {
      optiontow_ids.push(opt.id);
    })
  })

  afterAll(async () => {
    await prisma.$disconnect();
  })

  test("새로운 주문 생성하기", async () => {
    const orderItemsPayload = [
      { productId: productone_id, productOptionId: optionone_ids[0], quantity: 2 },
      { productId: producttwo_id, productOptionId: optiontow_ids[2], quantity: 1 },
    ];

    const customerPayload = {
      name: "홍길동",
      phone: "010-1234-5678",
      email: "honggil@test.com"
    };

    const deliveryPayload = {
      name: "김민수",
      phone: "010-1234-5678",
      address: "서울시 강남구 테헤란로 101 101동 102호",
      postcode: "06236",
    };

    const payload = {
      items: orderItemsPayload,
      customer: customerPayload,
      delivery: deliveryPayload,
    };

    const result = await orderService.createOrder(user, payload);
    const updatedOption1 = await productOptionDAO.findById(prisma, result.items[0].productOptionId);
    const updatedOption2 = await productOptionDAO.findById(prisma, result.items[1].productOptionId);

    expect(result.order).toBeDefined();
    expect(result.order.id).toBeGreaterThan(0);

    expect(result.customer.orderId).toBe(result.order.id);
    expect(result.delivery.orderId).toBe(result.order.id);
    expect(result.items.length).toBe(2);
    expect(result.items[0].productId).toBe(productone_id);

    expect(updatedOption1.stock).toBe(8);
    expect(updatedOption2.stock).toBe(4);
    
    expect(result.order.totalPrice).toBe(129000*(1-10/100)*2+200000*(1-50/100));
  })
  test("orderItems이 빈배열이거나 없을 때 `주문 상품 목록이 없습니다.`에러 반환", async() => {
    const orderItemsPayload = [];

    const customerPayload = {
      name: "홍길동",
      phone: "010-1234-5678",
      email: "honggil@test.com"
    };

    const deliveryPayload = {
      name: "김민수",
      phone: "010-1234-5678",
      address: "서울시 강남구 테헤란로 101 101동 102호",
      postcode: "06236",
    };

    const payload = {
      items: orderItemsPayload,
      customer: customerPayload,
      delivery: deliveryPayload,
    };

    try{
      await orderService.createOrder(user, payload);
    } catch(e) {
      expect(e.name).toBe(commonErrors.inputError);
      expect(e.message).toBe("주문 상품 목록이 없습니다.");
      expect(e.httpCode).toBe(400);
    }
  })
  test("배송지 필수 필드 누락 `배송 필수값 누락 : ` 에러 반환", async() => {
    const orderItemsPayload = [
      { productId: productone_id, productOptionId: optionone_ids[0], quantity: 2 },
      { productId: producttwo_id, productOptionId: optiontow_ids[2], quantity: 1 },
    ];

    const customerPayload = {
      name: "홍길동",
      phone: "010-1234-5678",
      email: "honggil@test.com"
    };

    const deliveryPayload = {
      name: "김민수",
      phone: "010-1234-5678",
    };

    const payload = {
      items: orderItemsPayload,
      customer: customerPayload,
      delivery: deliveryPayload,
    };

    try{
      await orderService.createOrder(user, payload);
    } catch(e){
      expect(e.name).toBe(commonErrors.inputError);
      expect(e.message).toContain("배송");
      expect(e.message).toContain("address");
      expect(e.message).toContain("postcode");
      expect(e.httpCode).toBe(400);
    }
  })
  test("상품이 없을 때 `해당 상품은 없습니다.` 에러 반환", async () => {
    const orderItemsPayload = [
      { productId: 9999, productOptionId: optionone_ids[0], quantity: 2 },
      { productId: producttwo_id, productOptionId: optiontow_ids[2], quantity: 1 },
    ];

    const customerPayload = {
      name: "홍길동",
      phone: "010-1234-5678",
      email: "honggil@test.com"
    };

    const deliveryPayload = {
      name: "김민수",
      phone: "010-1234-5678",
      address: "서울시 강남구 테헤란로 101 101동 102호",
      postcode: "06236",
    };

    const payload = {
      items: orderItemsPayload,
      customer: customerPayload,
      delivery: deliveryPayload,
    };
    
    try{
      await orderService.createOrder(user, payload);
    } catch (e) {
      expect(e.name).toBe(commonErrors.resourceNotFoundError);
      expect(e.message).toBe("해당 상품은 없습니다.");
      expect(e.httpCode).toBe(404);
    }
  })
  test("옵션이 없을 때 `해당 옵션은 없습니다.` 에러 반환", async() => {
        const orderItemsPayload = [
      { productId: productone_id, productOptionId: optionone_ids[0], quantity: 2 },
      { productId: producttwo_id, productOptionId: 9999, quantity: 1 },
    ];

    const customerPayload = {
      name: "홍길동",
      phone: "010-1234-5678",
      email: "honggil@test.com"
    };

    const deliveryPayload = {
      name: "김민수",
      phone: "010-1234-5678",
      address: "서울시 강남구 테헤란로 101 101동 102호",
      postcode: "06236",
    };

    const payload = {
      items: orderItemsPayload,
      customer: customerPayload,
      delivery: deliveryPayload,
    };

    try{
      await orderService.createOrder(user, payload);
    } catch (e) {
      expect(e.name).toBe(commonErrors.resourceNotFoundError);
      expect(e.message).toBe("해당 옵션은 없습니다.");
      expect(e.httpCode).toBe(404);
    }
  })
  test("재고 부족 시 `재고가 부족합니다.` 에러 반환", async () => {
    const orderItemsPayload = [
      { productId: productone_id, productOptionId: optionone_ids[0], quantity: 2 },
      { productId: producttwo_id, productOptionId: optiontow_ids[2], quantity: 10 },
    ];

    const customerPayload = {
      name: "홍길동",
      phone: "010-1234-5678",
      email: "honggil@test.com"
    };

    const deliveryPayload = {
      name: "김민수",
      phone: "010-1234-5678",
      address: "서울시 강남구 테헤란로 101 101동 102호",
      postcode: "06236",
    };

    const payload = {
      items: orderItemsPayload,
      customer: customerPayload,
      delivery: deliveryPayload,
    };

    try{
      await orderService.createOrder(user, payload);
    } catch (e) {
      expect(e.name).toBe(commonErrors.resourceNotFoundError);
      expect(e.message).toBe("재고가 부족합니다.");
      expect(e.httpCode).toBe(404);
    }

  })
})