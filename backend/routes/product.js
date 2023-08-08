const multer = require('multer');
const express = require('express');
const _ = require('lodash');
const { Product, validateProduct } = require('../models/product');
const router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images/products')
    },
    filename: (req, file, cb) => {
        cb(null, `${req.body.email}.jpg`)
    }
})
const upload = multer({storage: storage})

//dealing with post requests
router.post('/' , upload.array("pictures"), async (req, res) => {

    //creating user object
    let product = _.merge(req.body, {pictures:req.file.filename});
    
    //joi validation
    const { error } = validateProduct(product); 
    if (error) return res.status(400).send(error.details[0].message);

    // saving in db
    try{
        product = await Product.create(product)
        res.status(200).send(_.omit(product.dataValues,["password"]))
    } 
    catch (error) {
        res.status(500).send(error.message)
    }
});

module.exports = router;    