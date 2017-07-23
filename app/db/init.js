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

const Sample = sequelize.define('sample', {
    name: Sequelize.STRING
})

Sample.sync().then(()=>{}).catch((err)=>{console.log(err)})

module.exports = (sequelize, DataTypes) => {
    return {
        Sample
    }
}

/*
    * File for creating the database and connecting to it
    * Uses sequelize ORM module for more secure and easier database access
    * Since this file was "required" by the server, the code is automatically ran
    * Code:
    *   We first imported sequelize
    *   Next, we created a database connection via const sequelize = ...
    *   We then authenticated our connection via promise
    *   We then create a table variable called Sample with the column "name" of type "text" and the table name "sample"
    *   We then sync it with our database, adding the table to it
*/