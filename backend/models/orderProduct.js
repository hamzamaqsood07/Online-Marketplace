const { Sequelize } = require('sequelize');
const {db} = require('../startup/db');
const {Order} = require('./order');
const {Product} = require('./product');

//defining schema
const OrderProduct = db.define('orderProducts', {
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()')
    },
    updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()')
    },
});

Order.belongsToMany(Product, { through: OrderProduct });
Product.belongsToMany(Order, { through: OrderProduct });

//synchronizing table
(async () => {
    await db.sync();
  })();
  


module.exports = {OrderProduct};