var Sequelize = require('sequelize');

module.exports = {
	test: () => {
		return 'user service test successful!'
	}
}

/*
	* This file contains all database access functions for the users controller
	* For all db access requests, use javascript promises to ensure that the db api call finishes
	* Format:
	*	return <promise>
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