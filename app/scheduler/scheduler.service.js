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

//	helper function for service function
var find_slot_in_schedules_table = (schedule, slot_value) => {
	console.log(schedule)
	if (schedule.slot_1 == slot_value)
		return 'slot_1'
	else if (schedule.slot_2 == slot_value)
		return 'slot_2'
	else if (schedule.slot_3 == slot_value)
		return 'slot_3'
	else if (schedule.slot_4 == slot_value)
		return 'slot_4'
	else if (schedule.slot_5 == slot_value)
		return 'slot_5'
	else if (schedule.slot_6 == slot_value)
		return 'slot_6'
	else
		return null
}

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
		return Models.Schedules.findAll({
			where: {
				$or: [
					{ slot_1: null },
					{ slot_2: null },
					{ slot_3: null },
					{ slot_4: null },
					{ slot_5: null },
					{ slot_6: null }
				]
			} 
		})
			.then(schedules => {
				return schedules
			})
			.catch(err => {
				return err
			})
	},
	clear_timeslot: (applicant_id_number) => {
		return Models.Schedules.find({
			where: {
				$or: [
					{ slot_1: applicant_id_number },
					{ slot_2: applicant_id_number },
					{ slot_3: applicant_id_number },
					{ slot_4: applicant_id_number },
					{ slot_5: applicant_id_number },
					{ slot_6: applicant_id_number }
				]
			}
		})
			.then(schedule => {
				if(schedule.dataValues != null){
					var applicant_schedule_slot = find_slot_in_schedules_table(schedule.dataValues, applicant_id_number)
					if(applicant_schedule_slot) {
						return schedule.update({ [applicant_schedule_slot]: null})
							.then(updated => {
								return schedule.reload()
									.then(updated_schedule => {
										return Models.Applicants.find({ where: { id_number: applicant_id_number } })
											.then(applicant => {
												return applicant.update({ interview_sched: null })
													.then(update_res => {
														return applicant.reload()
															.then(updated_applicant => {
																return {
																	schedules_table_entry: updated_schedule,
																	applicants_table_entry: updated_applicant
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
									})
									.catch(err => {
										res.send(err)
									})
							})
							.catch(err => {
								return err
							})
					}
					else {
						return `This timeslot is full`
					}
				}
				else {
					return `This applicant hasn't signed up yet.`
				}
			})
			.catch(err => {
				return err
			})
	},
	find_schedule: (applicant_id_number) => {
		return Models.Schedules.find({
			where: {
				$or: [
					{ slot_1: applicant_id_number },
					{ slot_2: applicant_id_number },
					{ slot_3: applicant_id_number },
					{ slot_4: applicant_id_number },
					{ slot_5: applicant_id_number },
					{ slot_6: applicant_id_number }
				]
			}
		})
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
	schedule_applicant: (date, timeslot, applicant_id_number) => {
		//	find the schedule with the given date and time. sched has to also contain an empty slot
		return Models.Schedules.find({
			where: {
				date,
				timeslot,
				$or: [
					{ slot_1: null },
					{ slot_2: null },
					{ slot_3: null },
					{ slot_4: null },
					{ slot_5: null },
					{ slot_6: null }
				]
			}
		})
			.then(schedule => {
				//	check if there is an available schedule with the given date and time
				if(schedule){
					//	find the applicant with the given applicant id number
					return Models.Applicants.find({ where: { id_number: applicant_id_number } })
						.then(applicant => {
							applicant_id_number = applicant.dataValues.id_number
							//find within schedules the schedule with the given applicant id number
							return Models.Schedules.find({
								where: {
									$or: [
										{ slot_1: applicant_id_number },
										{ slot_2: applicant_id_number },
										{ slot_3: applicant_id_number },
										{ slot_4: applicant_id_number },
										{ slot_5: applicant_id_number },
										{ slot_6: applicant_id_number }
									]
								}
							})
								.then(search_if_exists => {
									//if the applicant has not yet signed up, add him to that schedule
									if(!search_if_exists) {
										var add_applicant_to_this_slot = find_slot_in_schedules_table(schedule, null)
										return schedule.update({ 
											[add_applicant_to_this_slot]: applicant_id_number
										})
											.then(update_res => {
												//	get the newly updated schedule
												return schedule.reload()
													.then(updated_schedule => {
														//	update the applicant's interview sched field in the applicants_table
														return applicant.update({
															interview_sched: `${updated_schedule.dataValues.date} ${updated_schedule.dataValues.timeslot}`
														})
															.then(update_res => {
																return updated_schedule.dataValues
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
									}
									else {	//	if the user already has a schedule, return this value:
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
				}
				else {
					return 'The selected timeslot is full'
				}
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
				    var start_date = '8-29-2017'
				    var end_date = '9-01-2017'
				    var start_time = '09:00'
				    var end_time = '17:00'
				    var interval = 10

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