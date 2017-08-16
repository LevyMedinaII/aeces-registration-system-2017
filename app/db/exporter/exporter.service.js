var Sequelize = require('sequelize')
var json2csv = require('json2csv')
var fs = require('fs')
require('dotenv').config()

var database = process.env.DATABASE
var username = process.env.DB_USER
var password = process.env.PASSWORD
var db_port = process.env.DB_PORT

var path = './backups'
var master_file_fields = [
	'id',
	'date',
	'timeslot',
	'is_taken',
	'applicant_id',
	'First Name',
	'Last Name',
	'Year',
	'Course',
	'New Member?',
	'Mobile Number',
	'Email',
	'Was Already Emailed?'
]
var schedules_table_fields = [
	'id',
	'date',
	'timeslot',
	'is_taken',
	'applicant_id'
]
var applicants_table_fields = [
	'id',
	'id_number',
	'first_name',
	'last_name',
	'year',
	'course',
	'block',
	'is_new_member',
	'id_pic_link',
	'mobile_number',
	'email',
	'interview_sched',
	'is_emailed'
]

var master_file_name = 'master_file.csv'
var schedules_tables_file_name = 'schedules_db.csv'
var applicants_tables_file_name = 'applicants_db.csv'

const sequelize = new Sequelize(`postgres://${username}:${password}@localhost:${db_port}/${database}`)

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.')
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err)
    })

const Models = sequelize.import('../init')
 
module.exports = {
	export_schedules: () => {
		return Models.Schedules.findAll({
			attributes: ['id', 'date', 'timeslot', 'slot_1', 'slot_2', 'slot_3', 'slot_4', 'slot_5', 'slot_6'] 
		})
			.then(schedules => {
				if(schedules.length > 0) {
					return Models.Applicants.findAll()
						.then(applicants => {
							if(applicants.length > 0) {
								var schedules_table_data = []
								var applicants_table_data = []

								//	Sets schedules table csv
								schedules.map(schedule => { schedules_table_data.push(schedule.dataValues) })

								//	Sets applicants table csv
								applicants.map(applicant => { applicants_table_data.push(applicant.dataValues) })

								var schedules_table_csv = json2csv({ data: schedules_table_data, fields: schedules_table_fields })
								var applicants_table_csv = json2csv({ data: applicants_table_data, fields: applicants_table_fields })

								//	write schedules table
								fs.writeFile(schedules_tables_file_name, schedules_table_csv, err => {
									if (err)
										return err
									console.log(`File saved as ${schedules_tables_file_name}`)
								})

								//	write applicants table
								fs.writeFile(applicants_tables_file_name, applicants_table_csv, err => {
									if (err)
										return err
									console.log(`File saved as ${applicants_tables_file_name}`)
								})

								return 'Database has been backed up.'
							}
							else {
								return 'There are no applicants yet.'
							}
						})
						.catch(err => {
							return err
						})
				}
				else {
					return 'Schedules have not yet been generated.'
				}
			})
	}
}