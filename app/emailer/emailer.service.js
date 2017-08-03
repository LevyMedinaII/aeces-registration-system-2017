var Sequelize = require('sequelize')
require('dotenv').config()

var database = process.env.DATABASE
var username = process.env.USER
var password = process.env.PASSWORD
var db_port = process.env.DB_PORT

const sequelize = new Sequelize(`postgres://${username}:${password}@localhost:${db_port}/${database}`)

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.')
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err)
    })

const Models = sequelize.import("../db/init")

module.exports = {
	test: () => {
		return 'Service [Emailer] Working'
	},
	get_applicant_email: (id) => {
		return Models.Applicants.find({ where: { id }})
			.then(applicant => {
				return applicant.dataValues.email
			})
			.catch(err => {
				return err
			})
	}
}