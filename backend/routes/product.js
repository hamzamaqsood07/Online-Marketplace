const fs = require('fs');
const path = require('path');
const multer = require('multer');
const express = require('express');
const _ = require('lodash');
const { Product, validateProduct, validateUpdateProduct } = require('../models/product');
const router = express.Router();
const auth = require('../middlewares/auth');
const seller = require('../middlewares/seller');
const buyer = require('../middlewares/buyer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../frontend/public/images/products')
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}.jpg`)
    }
})
const upload = multer({storage: storage})

//Adding an item
router.post('/', [auth, seller] , upload.array("pictures"), async (req, res) => {
    console.log(req.files);

    //creating user object
    let product = (req.files && req.files.length>0) ? 
        _.merge(req.body, {  pictures: req.files.map(file => file.filename)
     }) : req.body
     ;
    
    //joi validation
    const { error } = validateProduct(product); 
    if (error) return res.status(400).send(error.details[0].message);

    //setting seller id
    product.sellerId= req.user.id;

    // saving in db
    try{
        product = await Product.create(product)
        res.status(200).send(_.pick(product.dataValues,
            ["title","description","pictures","price","quantity", "sellerId", "id"]), );
    } 
    catch (error) {
        res.status(500).send(error.message)
    }
});

//Get all products of current user
router.get('/me', [auth, seller], async (req, res) => {
    try {
        const products = await Product.findAll({
            where: {
                sellerId: req.user.id
            },
            order: [
                ['id', 'DESC']
            ]
        });
        
        res.status(200).send(products);
    } 
    catch (error) {
        res.status(500).send(error.message);
    }
});

//delete a product
router.delete('/:productId', [auth, seller], async (req, res) => {
    const productId = req.params.productId;

    try {
        // Find the product by ID and sellerId (current user's ID)
        const product = await Product.findOne({
            where: {
                id: productId,
                sellerId: req.user.id
            }
        });

        // If the product doesn't exist or doesn't belong to the current user
        if (!product) {
            return res.status(404).send("Product not found or you don't have permission to delete it.");
        }

        // Delete the associated pictures from the file system
        if(product.dataValues.pictures && product.dataValues.pictures.length>0){
            for (const filename of product.dataValues.pictures) {
                const imagePath = path.join(__dirname, '..', '..', 'frontend','public', 'images', 'products', filename);
                fs.unlinkSync(imagePath);
            }
        }

        // Delete the product
        await product.destroy();

        res.status(200).send("Product deleted successfully.");
    } catch (error) {
        res.status(500).send(error.message);
    }
});


// Update a product by ID
router.put('/:productId', [auth, seller], upload.array("pictures"), async (req, res) => {
    const productId = req.params.productId;
    
    // Validate the incoming product attributes
    const { error } = validateUpdateProduct(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        // Find the product by ID and sellerId (current user's ID)
        let product = await Product.findOne({
            where: {
                id: productId,
                sellerId: req.user.id
            }
        });
        
        // If the product doesn't exist or doesn't belong to the current user
        if (!product) {
            return res.status(404).send("Product not found or you don't have permission to update it.");
        }

        // Delete the previous pictures from the file system if new photos are uploaded
        if (req.files && req.files.length > 0) {
            for (const filename of product.dataValues.pictures) {
                const imagePath = path.join(__dirname, '..', '..', 'frontend','public', 'images', 'products', filename);
                fs.unlinkSync(imagePath);
            }
        }
        
        // Update the product properties
        Object.keys(_.pick(req.body,["title","description","price","quantity"]))
            .map(attribute=>product[attribute]=req.body[attribute]);

        // Update the pictures if files are uploaded
        if (req.files && req.files.length > 0) {
            product.pictures = req.files.map(file => file.filename);
        }

        //setting product id and seller id
        product.id=productId;
        productsellerId=req.user.id;

        // Save the updated product
        await product.save();

        res.status(200).send(_.pick(product.dataValues,
            ["title","description","pictures","price","quantity", "sellerId", "id"]), );
    } catch (error) {
        res.status(500).send(error.message);
    }
});


module.exports = router;    












//..................................Buyer.............................

//Get all products
router.get('/', [auth, buyer], async (req, res) => {
    try {
        const products = await Product.findAll({
            order: [
                ['updatedAt', 'DESC']
            ]
        });
        
        res.status(200).send(products);
    } 
    catch (error) {
        res.status(500).send(error.message);
    }
});
