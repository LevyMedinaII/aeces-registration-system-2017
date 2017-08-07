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
	get_applicants_email: (id) => {
		return Models.Applicants.findAll({
			attributes: ['id', 'interview_sched','email', 'is_emailed']
		})
			.then(res => {
				var recipient_string = ''
				res.map((applicant, id) => {
					if(!applicant.dataValues.is_emailed && applicant.dataValues.interview_sched) {
						recipient_string += applicant.dataValues.email
						if(id+1 != res.length)
							recipient_string += ', '
						applicant.update({'is_emailed': true}).then(update_status=>{}).catch(err=>{ return err })
					}
				})
				return recipient_string
			})
			.catch(err => {
				return err
			})
	}
}