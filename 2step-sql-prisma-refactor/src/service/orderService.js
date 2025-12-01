const { productOptionDAO, orderItemDAO, orderDAO, productDAO, customerDAO, deliveryDAO } = require("../data-access/index.js");
const AppError = require("../misc/AppError.js");
const commonErrors = require("../misc/commonErrors.js");
const { createValidation, updateValidation } = require("../misc/utils.js");
const prisma = require("../prismaClient");

class OrderService {
  //주문 생성
  async createOrder(user, data) {
    const { items, delivery, customer } = data;
    const orderItems = items;
    let totalPrice = 0;

    if(!orderItems || orderItems.length === 0) {
      throw new AppError(
        commonErrors.inputError,
        "주문 상품 목록이 없습니다.",
        400
      );
    }

    createValidation(delivery, {type: "delivery"});
    createValidation(customer, {type: "customer" })

    for(const item of orderItems) {
      const product = await productDAO.findById(prisma, item.productId);

      if(!product) {
        throw new AppError(
          commonErrors.resourceNotFoundError,
          "해당 상품은 없습니다.",
          404
        )
      }

      const option = await productOptionDAO.findById(prisma, item.productOptionId);

      if(!option) {
        throw new AppError(
          commonErrors.resourceNotFoundError,
          "해당 옵션은 없습니다.",
          404
        );
      }

      if(item.quantity < 1) {
        throw new AppError(
          commonErrors.inputError,
          "주문 수량을 확인하세요.",
          400
        );
      } 

      if(option.stock < item.quantity) {
        throw new AppError(
          commonErrors.resourceNotFoundError,
          "재고가 부족합니다.",
          404
        );
      }

      totalPrice += product.price*(1-product.discountRate/100)*item.quantity;
    }
    const result = await prisma.$transaction(async(tx) => {
      const itemDatas = [];

      const order = await orderDAO.create(tx, {
        totalPrice,
        userId: user.id
      });

      const orderCustomer = await customerDAO.create(tx, {
        orderId: order.id,
        ...customer
      });

      const orderDelivery = await deliveryDAO.create(tx,{
        orderId: order.id,
        ...delivery
      });
      
      for(const item of orderItems) {
        const option = await productOptionDAO.findById(tx, item.productOptionId);
        
        if(option.stock < item.quantity) {
          throw new AppError(
            commonErrors.resourceNotFoundError,
            "재고가 부족합니다.",
            404
          )
        }

        const parentProduct = await productDAO.findById(tx, item.productId);
        const itemPrice = parentProduct.price * (1-parentProduct.discountRate/100);
        itemDatas.push({
        id: item.id,
        orderId: order.id,
        productId: item.productId,
        productOptionId: item.productOptionId,
        quantity: item.quantity,
        price: itemPrice
        })
        
        await productOptionDAO.decreaseStock(tx, item.productOptionId, item.quantity);
      }

  
      await orderItemDAO.createMany(tx, itemDatas);
      const createdItems = await orderItemDAO.findByOrderId(tx, order.id);
      
      return {order: order, customer: orderCustomer, delivery: orderDelivery, items: createdItems};
    })
    return result;
  }

  async getOrderById(id) {
    const order = await orderDAO.findById(prisma, id);

    if(!order || !order.userId) {
      throw new AppError(
        commonErrors.resourceNotFoundError,
        "해당 사용자의 주문 내역이 없습니다.",
        404
      )
    }

    const orderItem = await orderItemDAO.findByOrderId(prisma, order.id);
    const delivery = await deliveryDAO.findByOrderId(prisma, order.id);
    const customer = await customerDAO.findByOrderId(prisma,order.id);
    return {order, orderItem, delivery, customer};
  }

  //주문자 id 로 주문가져오기
  async getOrdersByUserId(userId) {
    const orders = await orderDAO.findByUserId(prisma, userId);
    return orders;
  }

  //주문 번호로 주문 가져오기
  async getOrderByOrderNum(orderNumber) {
    const order = await orderDAO.findByOrderNumber(prisma, orderNumber);
    return order;
  }

  //주문 수정
  async updateOrder(id, data) {
    if(!data || Object.keys(data).length === 0) {
      throw new AppError(
        commonErrors.inputError,
        "요청 받은 데이터가 없습니다.",
        400
      );
    }

    const { customer, delivery, items} = data;
    let totalPrice = undefined;

    if (customer) updateValidation(customer, { type: "customer" });
    if (delivery) updateValidation(delivery, { type: "delivery" });

    if(Array.isArray(items) && items.length > 0) {
      totalPrice = 0;

      for(const item of items) {
        const product = await productDAO.findById(prisma, item.productId);
  
        if(!product) {
          throw new AppError(
            commonErrors.resourceNotFoundError,
            "해당 상품이 없습니다.",
            404
          );
        }
  
        const productOption = await productOptionDAO.findById(prisma, item.productOptionId);
        if(!productOption){
          throw new AppError(
            commonErrors.resourceNotFoundError,
            "상품의 옵션이 없습니다.",
            404,
          );
        }
  
        totalPrice += product.price*(1-product.discountRate/100)*item.quantity;
      }
    }

    const order = await orderDAO.findById(prisma, id);  

    if(order.status !== "PENDING") {
      throw new AppError(
        commonErrors.inputError,
        "배송이 이미 진행 중이거나 완료되었습니다.",
        400
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const orderItems = [];
      const oldOrderItems = await orderItemDAO.findByOrderId(tx, id);

      if(Array.isArray(items) && items.length > 0) {
        for(const oldItem of oldOrderItems) {
          await productOptionDAO.increaseStock(tx, oldItem.productOptionId, oldItem.quantity);
        }

        for(const item of items) {
          const optionStock = (await productOptionDAO.findById(tx, item.productOptionId)).stock;
  
          if(item.quantity > optionStock) {
            throw new AppError(
              commonErrors.resourceNotFoundError,
              "재고가 부족합니다.",
              404
            );
          }
  
          const parentProduct = await productDAO.findById(tx, item.productId);
          const itemPrice = parentProduct.price*(1-parentProduct.discountRate/100);
          await productOptionDAO.decreaseStock(tx, item.productOptionId, item.quantity);
  
          orderItems.push({
          id: item.id,
          orderId: order.id,
          productId: item.productId,
          productOptionId: item.productOptionId,
          quantity: item.quantity,
          price: itemPrice
          })
        }
        
        await orderItemDAO.deleteByOrderId(tx, id);
        await orderItemDAO.createMany(tx, orderItems);
      }

      let updatedOrder;
      let updatedDelivery;
      let updatedCustomer;

      if(totalPrice !== undefined) {
        updatedOrder = await orderDAO.updateById(tx, id, {
          totalPrice
        })
      } else {
        updatedOrder = await orderDAO.findById(tx, id);
      }

      if(delivery) {
        updatedDelivery = await deliveryDAO.updateByOrderId(tx, id, delivery);
      } else {
        updatedDelivery = await deliveryDAO.findByOrderId(tx, id);
      }

      if(customer){
        updatedCustomer = await customerDAO.updateByOrderId(tx, id, customer);
      } else {
        updatedCustomer = await customerDAO.findByOrderId(tx, id);
      }

      const updatedItems = await orderItemDAO.findByOrderId(tx, id);

      return {updatedorder: updatedOrder, updatedCustomer: updatedCustomer, updatedDelivery: updatedDelivery, updatedItems: updatedItems};
    })

    return result;
  }

  async deleteOrder(id) {
    const order = await orderDAO.findById(prisma, id);

    if(!order) {
      throw new AppError(
        commonErrors.resourceNotFoundError,
        "주문이 없습니다.",
        404,
      );
    }

    if(order.status !== 'PENDING') {
      throw new AppError(
        commonErrors.businessError,
        "배송 중이거나 완료된 건입니다.",
        409
      );
    }

    const orderItems = await orderItemDAO.findByOrderId(prisma, id);

    const result = await prisma.$transaction(async (tx) => {
      for(const item of orderItems) {
        await productOptionDAO.increaseStock(tx, item.productOptionId, item.quantity);
      }

      await orderItemDAO.deleteByOrderId(tx, id);
      await customerDAO.deleteByOrderId(tx, id);
      await deliveryDAO.deleteByOrderId(tx, id);
      await orderDAO.deleteById(tx, id)

      return true;
    })

    return result;
  }
}

module.exports = new OrderService();
