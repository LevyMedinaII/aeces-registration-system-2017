var router = require('express').Router()
var service = require('./user.service')
var Sequelize = require('sequelize')

//PATH localhost:<port>/users/test
router.get('/test', (request, response) => {
	response.send(service.test());
})

module.exports = router

/*
 	* This is the user.controller file. It contains the routes for all requests with regards to users
 	* This is connected to the user.service file, which houses all database "model" access methods
 	* Code Explanation:
 	*	We imported the required packages
 	*	We used router, an instance of the express router to access the GET method
 	*	The first parameter of each method (GET/POST/PUT/DELETE/etc.) is the link
 	*		Since we imported this to our server.js file with access link: /users, the route will be
 				localhost:<port>/users/link, specifically in this case: localhost:<port>/users/test
 	*	The second parameter is the callback function, which contains the request and the response
 	*		The request variable gives us all the data in conjunction to the GET request to this link
 				such as queries, headers, and parameters
 	*		The response variable is what we will return as a response in conjunction to the request.
 	*		We send the response through the send method of the response variable
*/