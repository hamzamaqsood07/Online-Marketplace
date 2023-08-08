const { Sequelize } = require('sequelize');
const {db} = require('../startup/db');
const Joi = require('joi');

//defining schema
const products = db.define('products', {
    title: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
    },
    price: {
        type: Sequelize.INTEGER
    },
    quantity: {
        type: Sequelize.INTEGER
    },
    images: {
        type: Sequelize.ARRAY(Sequelize.STRING)
    }
});
//synchronizing table
(async () => {
    await db.sync(); 
    console.log('Table synchronized');
  })();


//validating product
const validateProduct =function(product){
    const schema = Joi.object({
        title: Joi.string().max(30).required(),
        description: Joi.string().max(200).required(),
        quantity: Joi.number().required(),
        price: Joi.number().min(8).max(30).required(),
        pictures: Joi.array().items(Joi.string()).required(),
    });
    return schema.validate(product);
}

//export commands
module.exports.Product = products;
module.exports.validateProduct = validateProduct;