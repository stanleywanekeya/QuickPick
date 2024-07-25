const express = require('express');
const multer = require('multer');
const shortid = require('shortid');
const path = require('path');
const router = express.Router();
const { requireSignin, adminMiddleware } = require('../common-middleware/index');
const { createProduct } = require('../controllers/product');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), 'uploads'))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, shortid.generate() + '-' + file.originalname)
  }
})
const upload = multer({ storage: storage });

router.post('/product/create', requireSignin, adminMiddleware, upload.array('productPicture'), createProduct);

module.exports = router
