const { Sequelize } = require('sequelize');
const config = require("config")
/**
 * The method connects server to the database.
 */
module.exports = async function () {
  const sequelize = new Sequelize('Online-Marketplace-DB', 'postgres', config.get('dbPassword'), {
    host: 'localhost',
    dialect: 'postgres'
  });
  try {
    await sequelize.authenticate();
    console.log('Connection to database has been established successfully.');
  } 
  catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};
