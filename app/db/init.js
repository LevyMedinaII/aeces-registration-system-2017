var Sequelize = require('sequelize')
require('dotenv').config()

var database = process.env.DATABASE
var username = process.env.USERNAME
var password = process.env.PASSWORD

const sequelize = new Sequelize(database, username, password, {
  host: 'localhost',
  dialect: 'postgres',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });