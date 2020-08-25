const { Product, validate } = require("../models/product");
const { Genre } = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const moment = require("moment");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const products = await Product.find().select("-__v").sort("name");
  res.send(products);
});

router.post("/", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");

  const product = new Product({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    price: req.body.price,
    publishDate: moment().toJSON(),
  });
  await product.save();

  res.send(product);
});

router.put("/:id", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      price: req.body.price,
    },
    { new: true }
  );

  if (!product)
    return res.status(404).send("The product with the given ID was not found.");

  res.send(product);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const product = await Product.findByIdAndRemove(req.params.id);

  if (!product)
    return res.status(404).send("The product with the given ID was not found.");

  res.send(product);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const product = await Product.findById(req.params.id).select("-__v");

  if (!product)
    return res.status(404).send("The product with the given ID was not found.");

  res.send(product);
});

module.exports = router;
