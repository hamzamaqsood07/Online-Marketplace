const bcrypt = require('bcrypt');
const multer = require('multer');
const express = require('express');
const _ = require('lodash');
const { User, validateUser } = require('../models/user');
const router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images/profile-pics')
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}.jpg`)
    }
})
const upload = multer({storage: storage})

//dealing with post requests
router.post('/' , upload.single("profilePicture"), async (req, res) => {
    //checking for profile pic file
    if(!req.file) return res.status(400).send("Profile pic is missing!");
    //creating user object
    let user = _.merge(req.body, {profilePicture:req.file.filename});
    
    //joi validation
    const { error } = validateUser(user); 
    if (error) return res.status(400).send(error.details[0].message);

    //email already exists?
    const identicalUserInDB = await User.findOne({where: { email: user.email }}) 
    if (identicalUserInDB) {
        return res.status(400).send({ Message: "Email already exist" });
    }
    
    //hashing password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    // saving in db
    try{
        user = await User.create(user)
        res.status(200).send(_.omit(user.dataValues,["password"]))
    } 
    catch (error) {
        res.status(500).send(error.message)
    }
});

module.exports = router;    