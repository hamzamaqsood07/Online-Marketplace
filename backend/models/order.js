const { Sequelize } = require('sequelize');
const {db} = require('../startup/db');
const Joi = require('joi');

//defining schema
const Order = db.define('orders', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    totalAmount: {
        type: Sequelize.DECIMAL(10, 2), // Adjust precision and scale as needed
        allowNull: false,
    },
    status: {
      type: Sequelize.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
      defaultValue: 'pending',
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
    buyerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'users', // Name of the referenced table
            key: 'id'       // Name of the referenced column
        }
    }
  });

//synchronizing table
(async () => {
    await db.sync(); 
  })();
  

module.exports = {Order};