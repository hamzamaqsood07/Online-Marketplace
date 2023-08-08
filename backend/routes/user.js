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
        cb(null, `${req.body.email}.jpg`)
    }
})
const upload = multer({storage: storage})

//dealing with post requests
router.post('/' , upload.single("profilePicture"), async (req, res) => {
    if(!req.file) return res.status(400).send("Profile pic is missing!");
    let user = _.merge(req.body, {profilePicture:req.file.filename});
    console.log(user);
    //joi validation
    const { error } = validateUser(user); 
    if (error) return res.status(400).send(error.details[0].message);

    //email already exists?
    const identicalUserInDB = await User.findOne({where: { email: user.email }}) 
    if (identicalUserInDB) {
        return res.status(400).send({ Message: "Email already exist" });
    }

    //creating user object
    // user = _.pick(req.body, ['firstName', 'lastName', 'email', 'password','userType']); 
    // user.profilePic=req.file.filename;
    
    //hashing password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    // saving in db
    try{
        user = await User.create(user)
        res.status(200).send(user)
    } 
    catch (error) {
        res.status(500).send(error.message)
    }
});

module.exports = router;    