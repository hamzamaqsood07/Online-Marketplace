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
  
    // Group products by sellerId
    const productsBySeller = new Map();
    for (const { id, quantity } of products) {
      const product = await Product.findByPk(id);
      if (product) {
        if (!productsBySeller.has(product.sellerId)) {
          productsBySeller.set(product.sellerId, []);
        }
        productsBySeller.get(product.sellerId).push({ product, quantity });
      }
    }

    // Create orders for each seller
    const orders = [];
    for (const [sellerId, groupedProducts] of productsBySeller) {
      const order = await Order.create({
        status: 'pending', // Set to initial status value
        totalAmount: 0,
        buyerId,
        sellerId,
      });

      let totalAmount = 0; // Initialize totalAmount

      // Associate products with the order and set the quantity
      for (const { product, quantity } of groupedProducts) {
        await order.addProduct(product, { through: { quantity } });
        totalAmount += product.price * quantity; // Calculate totalAmount
        // Decrease the product quantity
        await product.update({ quantity: product.quantity - quantity });
      }

      // Update the order's totalAmount
      await order.update({ totalAmount });

      orders.push(order);
    }

    res.status(201).json({ message: 'Orders created successfully', orders });
  } catch (error) {
    console.error('Error creating orders:', error);
    res.status(500).json({ error: 'An error occurred while creating the orders' });
  }
});


  router.get('/me', [auth], async(req,res) => {
    const id = req.user.id;
    if (req.user.userType === 'buyer') {
      try {
        // Fetch orders for the buyer
        const orders = await Order.findAll({
          where: { buyerId: id },
          include: [{ model: Product }],
        });

        return res.status(200).json(orders);
      } 
      catch (error) {
        console.error('Error fetching orders:', error);
        return res.status(500).json({ error: 'An error occurred while fetching orders' });
      }
    }
    else if(req.user.userType==='seller'){
      try {
        // Fetch products listed by the seller
        const products = await Product.findAll({
          where: { sellerId: id },
          attributes: ['id'],
        });
  
        // Get the product IDs listed by the seller
        const productIds = products.map(product => product.id);
  
        // Fetch orders where the seller's products are listed
        const orders = await Order.findAll({
          include: [
            {
              model: Product,
              where: { id: productIds },
              through: { where: { productId: productIds } },
            },
          ],
        });
  
        return res.status(200).json(orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        return res.status(500).json({ error: 'An error occurred while fetching orders' });
      }
    }
    return res.status(403).send('Access denied.');
  });
  

  module.exports = router; 