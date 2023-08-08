const { Sequelize } = require('sequelize');
const {db} = require('../startup/db');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const config = require('config');

const users = db.define('users', {
    firstName: {
        type: Sequelize.STRING
    },
    lastName: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    userType: {
        type: Sequelize.STRING
    },
    profilePicture: {
        type: Sequelize.STRING
    }
});
const generateAuthToken = function(){
    const token = jwt.sign(_.pick(this,['id','firstName','lastName','email','userType','profilePicture']), config.get('jwtPrivateKey'));
    return token;
}
const validateUser =function(user){
    const schema = Joi.object({
        firstName: Joi.string().max(15).required(),
        lastName: Joi.string().max(15).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(30).required(),
        userType: Joi.string().required(),
        profilePicture: Joi.string().required()
    });
    return schema.validate(user);
}
module.exports.User = users;
module.exports.validateUser = validateUser;
module.exports.generateAuthToken = generateAuthToken;