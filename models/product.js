const Joi = require("joi");
const mongoose = require("mongoose");
const { genreSchema } = require("./genre");

const Product = mongoose.model(
  "Products",
  new mongoose.Schema({
    image: {
      type: String,
      trim: true,
      minlength: 5,
      maxlength: 255,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 255,
    },
    genre: {
      type: genreSchema,
      required: true,
    },
    numberInStock: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
    dailyRentalRate: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
  })
);

function validateProduct(product) {
  const schema = {
    // image: Joi.string().min(5).max(50),
    title: Joi.string().min(5).max(50).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
  };

  return Joi.validate(product, schema);
}

exports.Product = Product;
exports.validate = validateProduct;
