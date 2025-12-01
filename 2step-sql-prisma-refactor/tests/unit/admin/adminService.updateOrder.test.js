const { productOptionDAO, orderDAO } = require("../../../src/data-access");
const commonErrors = require("../../../src/misc/commonErrors");
const adminService = require("../../../src/service/adminService");
const orderService = require("../../../src/service/orderService");
const productService = require("../../../src/service/productService");
const { clearDatabase, prisma } = require("../../utils/testUtils")

let productone_id;
let producttwo_id;
let user;
let orderId;
let err_orderId;

let optionone_ids = [];
let optiontow_ids = [];

describe("orderService.updateOrder", () => {
  beforeEach(async () => {
    await clearDatabase();

    productone_id = undefined;
    producttwo_id = undefined;
    user = undefined;
    orderId = undefined;

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
    orderId = result.order.id;
    await orderDAO.updateById(prisma, orderId, {
      status: "SHIPPING"
    });

    const orderItemsPayload_err = [
      { productId: productone_id, productOptionId: optionone_ids[0], quantity: 2 },
      { productId: producttwo_id, productOptionId: optiontow_ids[2], quantity: 1 },
    ];

    const customerPayload_err = {
      name: "홍길동",
      phone: "010-1234-5678",
      email: "honggil@test.com"
    };

    const deliveryPayload_err = {
      name: "김민수",
      phone: "010-1234-5678",
      address: "서울시 강남구 테헤란로 101 101동 102호",
      postcode: "06236",
    };

    const payload_err = {
      items: orderItemsPayload_err,
      customer: customerPayload_err,
      delivery: deliveryPayload_err,
    };

    const err_result = await orderService.createOrder(user, payload_err);
    err_orderId = err_result.order.id;
    await orderDAO.updateById(prisma, err_orderId, {
      status: "DELIVERED"
    });
  })
  afterAll(async() => {
    await prisma.$disconnect();
  })
  test("주문 수정하기", async() => {
    const orderPayload = {
      status: "CANCELED"
    }

    const customerPayload = {
      name: "홍길동",
      phone: "010-1234-5678",
      email: "honggil@test.com"
    };

    const deliveryPayload = {
      name: "김민수",
      phone: "010-4321-8765",
      address: "경남 창원시 창이대로 202도 202호",
      postcode: "98764",
    };

    const payload = {
      order: orderPayload,
      customer: customerPayload,
      delivery: deliveryPayload,
    };

    const result = await adminService.updateOrder(orderId, payload);
    
    expect(result.order).toBeDefined();
    expect(result.order.id).toBeGreaterThan(0);
    expect(result.order.status).toBe("CANCELED");

    expect(result.customer.orderId).toBe(result.order.id);
    expect(result.delivery.orderId).toBe(result.order.id);    
  })

  test("주문이 없을 때 `주문이 없습니다.` 에러 반환", async () =>{
    const testOrderId = 9999;
    const payload = [];

    try{
      await adminService.updateOrder(testOrderId, payload);
    } catch (e) {
      expect(e.name).toBe(commonErrors.resourceNotFoundError);
      expect(e.message).toBe("주문이 없습니다.");
      expect(e.httpCode).toBe(404);
    }
  })

  test("주문, 배송지 또는 수령인 필드 빈 값일 때 `빈 값일 수 없습니다.` 에러 반환", async() => {
    const orderPayload = {
      status: " "
    };

    const payload = {
      order: orderPayload
    };

    try{
      await adminService.updateOrder(orderId, payload);
    } catch (e) {
      expect(e.name).toBe(commonErrors.argumentError);
      expect(e.message).toContain("status");
      expect(e.message).toContain("빈 값일 수 없습니다.");
      expect(e.httpCode).toBe(400);
    }
  });

  test("수정하려는 주문이 DELIVERED 또는 CANCELED 상태일 때 `이미 배송 되었거나 취소된 건입니다.` 에러 반환", async () => {
    const customerPayload = {
      name: "홍길동",
      phone: "010-1234-5678",
      email: "honggil@test.com"
    };

    const deliveryPayload = {
      name: "김민수",
      phone: "010-4321-8765",
      address: "경남 창원시 창이대로 202도 202호",
      postcode: "98764",
    };

    const payload = {
      customer: customerPayload,
      delivery: deliveryPayload,
    };

    try{
      await adminService .updateOrder(err_orderId, payload);
    } catch (e) {
      expect(e.name).toBe(commonErrors.businessError);
      expect(e.message).toBe("이미 배송 되었거나 취소된 건입니다.");
      expect(e.httpCode).toBe(400);
    }
  })
})