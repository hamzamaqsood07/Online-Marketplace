const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth')
const buyer = require('../middlewares/buyer')
const {Order} = require('../models/order')
const {Product} = require('../models/product')
const {OrderProduct} = require('../models/orderProduct')

// routes.js
router.post('/', [auth, buyer], async (req, res) => {
    try {
      const { products } = req.body;
      const buyerId = req.user.id; // Obtain the buyerId from the token
  
      // Create a new order with status set to initial value
      const order = await Order.create({
        status: 'pending', // Set to initial status value
        totalAmount: 0,
        buyerId,
      });
  
      let totalAmount = 0; // Initialize totalAmount
  
      // Associate products with the order and set the quantity
      for (const { id, quantity } of products) {
        const product = await Product.findByPk(id);
        if (product) {
          //populate relationship table
          await order.addProduct(product, { through: { quantity } });
          totalAmount += product.price * quantity; // Calculate totalAmount
          //decrease the product quantity
          product.update({quantity:product.quantity-quantity});
        }
      }
  
      // Update the order's totalAmount
      await order.update({ totalAmount });

  
      res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'An error occurred while creating the order' });
    }
  });
  

  module.exports = router; 