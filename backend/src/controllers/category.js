const Category = require('../models/category');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');


function createCategories(categories, parentId = null) {
  const categoryList = [];
  let category;

  if (parentId === null) {
	category = categories.filter(cat => cat.parentId === undefined)
  } else {
	category = categories.filter(cat => cat.parentId == parentId);
  }

  for (let cate of category) {
	categoryList.push({
	  _id: cate._id,
	  name: cate.name,
	  slug: cate.slug,
	  children: createCategories(categories, cate._id)
	});
  }

  return categoryList;
}

exports.addCategory = asyncHandler(async (req, res, next) => {
  const categoryObj = {
	name: req.body.name,
	slug: slugify(req.body.name),
  }

  if (req.file) {
	categoryObj.categoryImage = proccess.env.API + '/public/' + req.file.filename;
  }

  if (req.body.parentId) {
	categoryObj.parentId = req.body.parentId;
  }

  const cat = new Category(categoryObj);
  const category = await cat.save();

  if (category) {
	return res.status(201).json({ category });
  }
});

exports.getCategories = asyncHandler(async (req, res, next) => {
  categories = await Category.find({});

  if (categories) {
	const categoryList = createCategories(categories);
	return res.status(200).json({ categoryList });
  }
});
