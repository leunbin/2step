//@desc order schema

const mongoose = require("mongoose");
const crypto = require("node:crypto");

const orderSchema = new mongoose.Schema(
  {
    userId : {
      type : mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    orderNumber: {
      type: String,
      required: true,
      unique: true,
      default: () => crypto.randomUUID(),
    },

    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    deliverStatus: {
      type: Boolean,
      default: false,
    },

    //주문자 정보
    customer: {
      name: {
        type: String,
        required: [true, "이름은 꼭 기입해주세요."],
      },
      phone: {
        type: String,
        required: [true, "전화번호는 꼭 기입해주세요."],
      },
      email: {
        type: String,
        required: true,
      },
    },

    //배송 정보
    delivery: {
      name: {
        type: String,
        required: [true, "이름은 꼭 기입해주세요."],
      },
      phone: {
        type: String,
        required: [true, "전화번호는 꼭 기입해주세요."],
      },
      postcode: {
        type: String,
        required: [true, "우편번호는 꼭 기입해주세요."],
      },
      address: {
        type: String,
        required: [true, "주소는 꼭 기입해주세요."],
      },
    },
  },
  { timestamps: true },
);

// orderSchema.virtual("calculateTotalAmount").get(function () {
//   if (this.products && this.products.length > 0) {
//     return this.products.reduce((total, product) => total + product.price, 0);
//   } else {
//     return this.totalAmount;
//   }
// });

module.exports = orderSchema;
