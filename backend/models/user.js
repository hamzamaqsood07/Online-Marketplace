const { Sequelize } = require('sequelize');
const {db} = require('../startup/db');
const Joi = require('joi');

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