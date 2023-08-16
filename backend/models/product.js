const { Sequelize } = require('sequelize');
const {db} = require('../startup/db');
const Joi = require('joi');

//defining schema
const products = db.define('products', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    },
    price: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    pictures: {
        type: Sequelize.ARRAY(Sequelize.STRING)
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
    sellerId: {
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


//validating product
const validateProduct =function(product){
    const schema = Joi.object({
        title: Joi.string().max(30).required(),
        description: Joi.string().max(200).required(),
        quantity: Joi.number().required(),
        price: Joi.number().required(),
        pictures: Joi.array().items(Joi.string())
    });
    return schema.validate(product);
}

const validateUpdateProduct = function(product){
    const schema = Joi.object({
        title: Joi.string().max(30),
        description: Joi.string().max(200),
        quantity: Joi.number(),
        price: Joi.number(),
        pictures: Joi.array().items(Joi.string())
    });
    return schema.validate(product);
}

//export commands
module.exports.Product = products;
module.exports.validateProduct = validateProduct;
module.exports.validateUpdateProduct = validateUpdateProduct;