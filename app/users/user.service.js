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
		return 'Service [user] is working.'
	}, 
	get_sample: () => {
		return Models.Sample.findAll()
			.then(res => {
				return res
			})
			.catch(err => {
				return err
			})
	},

	add: (id_number, first_name, last_name, year, course, block, is_new_member, id_pic_link, mobile_number, email, interview_sched) => {
		return Models.Applicants.findAll({ where: {id_number }})
			.then(search_res => {
				if(search_res.length == 0) {
					return Models.Applicants.create({
						id_number,
						first_name,
						last_name,
						year,
						course,
						block,
						is_new_member,
						id_pic_link,
						mobile_number,
						email,
						interview_sched
					})
						.then(res => {
							return res
						})
						.catch(err => {
							return err
						})
				}
				else {
					return `ID Number ${id_number} already exists in the database`
				}
			})
	},
	get_all: () => {
		return Models.Applicants.findAll()
			.then(res => {
				return res
			})
			.catch(err => {
				return err
			})
	},
	get: (id) => {
		return Models.Applicants.find({ where: {id} })
			.then(res => {
				return res
			})
			.catch(err => {
				return err
			})
	},
	update: (id, id_number, first_name, last_name, year, course, block, is_new_member, id_pic_link, mobile_number, email, interview_sched) => {
		return Models.Applicants.find({ where: {id} })
			.then(applicant => {
				return applicant.updateAttributes({
					id_number, 
					first_name, 
					last_name, 
					year, 
					course, 
					block, 
					is_new_member, 
					id_pic_link, 
					mobile_number, 
					email, 
					interview_sched
				})
					.then(res => {
						return 'Update successful'
					})
					.catch(err => {
						return err
					})
			})
			.catch(err => {
				return err
			})
	},
	delete: (id) => {
		return Models.Applicants.find({ where: {id} })
			.then(applicant => {
				return applicant.destroy()
					.then(res => {
						return res
					})
					.catch(err => {
						return err
					})
			})
			.catch(err => {
				return err
			})
	}
}

/*
	* This file contains all database access functions for the users controller
	* For all db access requests, use javascript promises to ensure that the db api call finishes
	* Format:
	*	return <promise>
	*   Promises are async functions that always return a value, whether a successful request <.then(response_parameter_name)>
          	is performed, or a bad request is performed <.catch(error_parameter_name)>
	* Example:
	*	add: (name, age, gender) => {
	*		return Models.Users.create(params)
				.then(res => {
					// on successful request to the db, gives us a callback function with response "res" from the db
					return res
				})
				.catch(err => {
					// on error request to the db, gives us a callback function with the error "err" from the db
					return err
				})
		}
*/