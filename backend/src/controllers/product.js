const asyncHandler = require('express-async-handler');
const Product = require('../models/product');
const shortid = require('shortid');
const slugify = require('slugify');

exports.createProduct = asyncHandler(async (req, res, next) => {

  const {
	 name, price, description, category, quantity, createdBy
  } = req.body;

  let productPictures = [];

  if (req.files.length > 0) {
	productPictures = req.files.map(file => {
	  return { img: file.filename };
	})
  }

  const product = new Product({
	name: name,
	slug: slugify(name),
	price,
	quantity,
	description,
	productPictures,
	category,
	createdBy: req.user._id
  });
  const products = await product.save();
  if (products) {
	res.status(201).json({ products });
  }
});
