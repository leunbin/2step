const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    discountRate: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    imgUrl: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    state:{
      type:String,
      required: true,
    }
  },
  {
    collection: "Product",
    versionKey: false,
    timestamps: true,
  },
);

module.exports = productSchema;
