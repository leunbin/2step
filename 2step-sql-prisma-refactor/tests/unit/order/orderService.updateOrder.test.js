const { productOptionDAO, orderItemDAO, orderDAO } = require("../../../src/data-access");
const commonErrors = require("../../../src/misc/commonErrors");
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
      status: "SHIPPING"
    });
  })
  afterAll(async() => {
    await prisma.$disconnect();
  })
  test("주문 수정하기", async() => {
    const orderItemsPayload = [
      { productId: productone_id, productOptionId: optionone_ids[2], quantity: 3 },
      { productId: producttwo_id, productOptionId: optiontow_ids[0], quantity: 2 },
    ];

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
      items: orderItemsPayload,
      customer: customerPayload,
      delivery: deliveryPayload,
    };

    const result = await orderService.updateOrder(orderId, payload);
    const updatedOption1 = await productOptionDAO.findById(prisma, result.updatedItems[0].productOptionId);
    const updatedOption2 = await productOptionDAO.findById(prisma, result.updatedItems[1].productOptionId);
    
    expect(result.updatedorder).toBeDefined();
    expect(result.updatedorder.id).toBeGreaterThan(0);

    expect(result.updatedCustomer.orderId).toBe(result.updatedorder.id);
    expect(result.updatedDelivery.orderId).toBe(result.updatedorder.id);
    expect(result.updatedItems.length).toBe(2);
    expect(result.updatedItems[0].productId).toBe(productone_id);

    expect(updatedOption1.stock).toBe(9);
    expect(updatedOption2.stock).toBe(3);
    
    expect(result.updatedorder.totalPrice).toBe(129000*(1-10/100)*3+200000*(1-50/100)*2);
  })

  test("주문 아이템 외 기본 주문 정보 수정하기", async () =>{
    const orderItemsPayload = [ ];

    const customerPayload = {
      name: "홍길동",
      phone: "010-1234-5678",
      email: "newEmail@test.com"
    };

    const deliveryPayload = {
      name: "박민수",
      address: "경남 창원시 창이대로 202도 202호",
      postcode: "98764",
    };

    const payload = {
      items: orderItemsPayload,
      customer: customerPayload,
      delivery: deliveryPayload,
    };

    const oldOrderItems = await orderItemDAO.findByOrderId(prisma, orderId);
    const oldOrder = await orderService.getOrderById(orderId);
    const result = await orderService.updateOrder(orderId, payload);

    expect(result.updatedItems).toEqual(oldOrderItems);
    expect(oldOrder.order.totalPrice).toBe(result.updatedorder.totalPrice)
  })

  test("요청 받은 데이터가 없으면 `요청 받은 데이터가 없습니다.` 에러 반환", async() => {
    const payload = {};
    try{
      await orderService.updateOrder(orderId, payload);
    } catch(e) {
      expect(e.name).toBe(commonErrors.inputError);
      expect(e.message).toBe("요청 받은 데이터가 없습니다.");
      expect(e.httpCode).toBe(400);
    }
  })
  test("order item의 상품 아이디가 없는 경우 `해당 상품이 없습니다.` 에러 반환", async() =>{
    const orderItemsPayload = [
      { productId: 9999, productOptionId: optionone_ids[2], quantity: 3 },
      { productId: producttwo_id, productOptionId: optiontow_ids[0], quantity: 2 },
    ];

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
      items: orderItemsPayload,
      customer: customerPayload,
      delivery: deliveryPayload,
    };
    try{
      await orderService.updateOrder(user, payload);
    } catch (e) {
      expect(e.name).toBe(commonErrors.resourceNotFoundError);
      expect(e.message).toBe("해당 상품이 없습니다.");
      expect(e.httpCode).toBe(404);
    }
  })
  test("상품 옵션이 없는 경우 `상품의 옵션이 없습니다.` 에러 반환", async() => {
    const orderItemsPayload = [
      { productId: productone_id, productOptionId: 9999, quantity: 3 },
      { productId: producttwo_id, productOptionId: optiontow_ids[0], quantity: 2 },
    ];

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
      items: orderItemsPayload,
      customer: customerPayload,
      delivery: deliveryPayload,
    };
    try{
      await orderService.updateOrder(orderId, payload);
    } catch(e) {
      expect(e.name).toBe(commonErrors.resourceNotFoundError);
      expect(e.message).toBe("상품의 옵션이 없습니다.");
      expect(e.httpCode).toBe(404);
    }
  })
  test("배송지 또는 수령인 필드 빈 값일 때 `빈 값일 수 없습니다.` 에러 반환", async() => {
    const customerPayload = {
      name: " ",
      phone: "010-1234-5678",
      email: "honggil@test.com"
    };

    const payload = {
      customer: customerPayload
    };

    try{
      await orderService.updateOrder(orderId, payload);
    } catch (e) {
      expect(e.name).toBe(commonErrors.argumentError);
      expect(e.message).toContain("name");
      expect(e.message).toContain("빈 값일 수 없습니다.");
      expect(e.httpCode).toBe(400);
    }
  });
  test("수정하려는 주문이 배송중일 때 `배송이 이미 진행 중이거나 완료되었습니다.` 에러 반환", async () => {
    const orderItemsPayload = [
      { productId: productone_id, productOptionId: optionone_ids[2], quantity: 3 },
      { productId: producttwo_id, productOptionId: optiontow_ids[0], quantity: 2 },
    ];

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
      items: orderItemsPayload,
      customer: customerPayload,
      delivery: deliveryPayload,
    };
    try{
      await orderService.updateOrder(err_orderId, payload);
    } catch (e) {
      expect(e.name).toBe(commonErrors.inputError);
      expect(e.message).toBe("배송이 이미 진행 중이거나 완료되었습니다.");
      expect(e.httpCode).toBe(400);
    }
  })
  test("수정하려는 아이템의 재고가 부족할 때 `재고가 부족합니다` 에러 반환", async () =>{
    const orderItemsPayload = [
      { productId: productone_id, productOptionId: optionone_ids[2], quantity: 20 },
      { productId: producttwo_id, productOptionId: optiontow_ids[0], quantity: 2 },
    ];

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
      items: orderItemsPayload,
      customer: customerPayload,
      delivery: deliveryPayload,
    };
    try{
      await orderService.updateOrder(orderId, payload);
    } catch (e) {
      expect(e.name).toBe(commonErrors.resourceNotFoundError);
      expect(e.message).toBe("재고가 부족합니다.");
      expect(e.httpCode).toBe(404);
    }
  })
})