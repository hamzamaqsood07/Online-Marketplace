const { Sequelize } = require('sequelize');
const {db} = require('../startup/db');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const config = require('config');

//defining schema
const users = db.define('users', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
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
    }
});
//synchronizing table
(async () => {
    await db.sync(); 
  })();

//generating token
const generateAuthToken = function(user){
    const token = jwt.sign(
        _.pick(user,['id','firstName','lastName','email','userType','profilePicture']),      
        config.get('jwtPrivateKey')
        );
    return token;
}

//validating user
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

//export commands
module.exports.User = users;
module.exports.validateUser = validateUser;
module.exports.generateAuthToken = generateAuthToken;