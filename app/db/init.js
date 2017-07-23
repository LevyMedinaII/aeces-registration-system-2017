var Sequelize = require('sequelize')
require('dotenv').config()

var database = process.env.DATABASE
var username = process.env.USER
var password = process.env.PASSWORD
var db_port = process.env.DB_PORT

const sequelize = new Sequelize(`postgres://${username}:${password}@localhost:${db_port}/${database}`);
sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.')
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err)
    })

//TABLE DEFINITIONS
const Sample = sequelize.define('sample', {
    name: Sequelize.STRING
})
const Applicants = sequelize.define('applicants', {
    id_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    first_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    last_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    year: {
        type: Sequelize.STRING,
        allowNull: false
    },
    course: {
        type: Sequelize.STRING,
        allowNull: false
    },
    block: {
        type: Sequelize.STRING,
        allowNull: false
    },
    is_new_member: {
        type: Sequelize.STRING,
        allowNull: false
    },
    id_pic_link: {
        type: Sequelize.STRING,
        unique: true
    },
    mobile_number: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    interview_sched: Sequelize.STRING
})

//TABLE CREATION
Sample                  .sync().then(()=>{}).catch((err)=>{console.log(err)})
Applicants              .sync().then(()=>{}).catch((err)=>{console.log(err)})

module.exports = (sequelize, DataTypes) => {
    return {
        Sample, 
        Applicants
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