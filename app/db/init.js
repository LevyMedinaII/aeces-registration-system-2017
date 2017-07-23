var Sequelize = require('sequelize')
require('dotenv').config()

var database = process.env.DATABASE
var username = process.env.USER
var password = process.env.PASSWORD
var db_port = 5433
var db_url = 'localhost'

const sequelize = new Sequelize(`postgres://${username}:${password}@${db_url}:${db_port}/${database}`);

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })

/*
    * File for creating the database and connecting to it
    * Uses sequelize ORM module for more secure and easier database access
*/