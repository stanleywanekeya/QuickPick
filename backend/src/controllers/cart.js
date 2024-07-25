const Cart = require('../models/cart');
const asyncHandler = require('express-async-handler');

exports.addItemToCart = asyncHandler(async (req, res, next) => {
  const cartItem = await Cart.findOne({ user: req.user._id });
  if (cartItem) {
	const product = req.body.cartItems.product;
	const item = cartItem.cartItems.find(c => c.product == product)
	let condition, update;

	if (item) {
	  condition = { user: req.user._id, "cartItems.product": product };
	  update = {
		"$set": {
		  "cartItems.$": {
			...req.body.cartItems,
			quantity: item.quantity + req.body.cartItems.quantity
		  }
		}
	  };
	} else {
	  condition = { user: req.user._id };
	  update = {
		"$push": {
		  "cartItems": req.body.cartItems
		}
	  }
	}

	const cartItems = await Cart.findOneAndUpdate(condition, update);

	if (cartItems) {
	  return res.status(201).json({ cart: cartItems });
	}
  } else {
	const cart = new Cart({
	  user: req.user._id,
	  cartItems: [req.body.cartItems],
	});

	const carts = await cart.save();
	if (carts) {
	  return res.status(201).json({ carts });
	}
  }

});
