var Sequelize = require('sequelize')
var moment = require('moment')
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
	get_all: () => {
		return Models.Schedules.findAll()
			.then(schedules => {
				return schedules
			})
			.catch(err => {
				return err
			})
	},
	get_all_free: () => {
		return Models.Schedules.findAll({ where: { is_taken: false, applicant_id: null } })
			.then(schedules => {
				return schedules
			})
			.catch(err => {
				return err
			})
	},
	clear_timeslot: (applicant_id) => {
		return Models.Schedules.find({ where: { applicant_id } })
			.then(schedule => {
				if(schedule){					
					return schedule.update({ is_taken: false, applicant_id: null })
						.then(update_res => {
							return `Timeslot ${schedule.dataValues.date} ${schedule.dataValues.timeslot} has been cleared.` 
						})
						.catch(err => {
							return err
						})
				}
				else {
					return `This applicant hasn't signed up yet.`
				}
			})
			.catch(err => {
				return err
			})
	},
	find_schedule: (applicant_id) => {
		return Models.Schedules.find({ where: { applicant_id } })
			.then(schedule => {
				if(schedule){
					return schedule.dataValues
				}
				else {
					return `This applicant hasn't signed up yet.`
				}
			})
			.catch(err => {
				return err
			})
	},
	schedule_applicant: (date, timeslot, applicant_id) => {
		return Models.Schedules.find({ where: { date, timeslot } })
			.then(schedule => {
				return Models.Applicants.find({ where: { id: applicant_id }, attributes: ['id'] })
					.then(applicant_id => {
						applicant_id = applicant_id.dataValues.id
						return Models.Schedules.find({ where: { applicant_id }})
							.then(search_if_exists => {
								if(!search_if_exists){
									return schedule.update({ 
										applicant_id, 
										is_taken: true, 
										where: { is_taken: false } 
									})
										.then(update_res => {
											return Models.Schedules.find({ where: { applicant_id } })
												.then(updated_schedule => {
													return updated_schedule.dataValues
												})
												.catch(err => {
													return err
												})
										})
										.catch(err => {
											return err
										})
								}
								else {
									return 'User already has a schedule. Please delete his schedule first'
								}
							})
							.catch(err => {
								return err
							})
					})
					.catch(err => {
						return err
					})
			})
			.catch(err => {
				return err
			})
	},
	generate: () => {
		return Models.Schedules.findAll()
			.then(schedules => {
				if(schedules.length == 0) {
					// Creates timeslots from the start_date to the end_date, and start_time to end_time with the given interval in minutes
				    var start_date = '8-23-2017'
				    var end_date = '8-25-2017'
				    var start_time = '08:00'
				    var end_time = '17:00'
				    var interval = 30

				    var date_format = 'MM-DD-YYYY'
				    var timeslot_format = 'HH:mm'

				    //  Create momentjs objects for interval algorithms
				    var current_date_generator = moment(start_date)
				    var current_time_generator = moment(`${start_date} ${start_time}`)

				    //  Date and Time strings for input to database
				    var date = current_date_generator.format(date_format)
				    var timeslot = current_time_generator.format(timeslot_format)

				    //  End Date and End Time strings for comparison
				    var end_date_string = moment(end_date).format(date_format)
				    var end_time_string = moment(`${end_date} ${end_time}`).format(timeslot_format)

				    //  Iterate through every date
				    do {
				        date = current_date_generator.format(date_format)
				        console.log(date, end_date_string)

				        //  For each date, insert time and date, increment time by the interval and repeat til the end time
				        do {
				            timeslot = current_time_generator.format(timeslot_format)
				            Models.Schedules.create({ date, timeslot })
				                .then(create_res => {
				                    console.log('Added Interview Schedule:', create_res.dataValues.timeslot)
				                })
				                .catch(err => {
				                    console.log(err)
				                })
				            current_time_generator.add(interval, 'minutes')
				        }
				        while(timeslot != end_time_string)

				        //Go to the next day, and reset the time
				        current_date_generator.add(1, 'days')
				        current_time_generator = moment(`${start_date} ${start_time}`)
				    }
				    while(date != end_date_string)
				    return 'Timeslots have been generated'
				}
				else {
					return 'There is an existing schedule table. Please delete the table first and restart the server to generate fresh timeslots.'
				}
			})
			.catch(err => {
				return err
			})
		
	}
}