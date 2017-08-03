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
 	* NOTE: Do not forget to follow RESTful architecture. DO NOT FOLLOW THE URL FORMAT OF THE TEST ROUTES.
 	*	EXAMPLES:
 	*		GET /users/				-->		Returns a list of all the users
 	*		GET /users/:id 			-->		Returns the user with the given id
 	*		POST /users				-->		Adds a user
 	*		PUT /users/:id 			-->		Updates the user with the given id
 	*		DELETE /users/:id 		-->		Deletes the user with the given id
*/

var router = require('express').Router()
var service = require('./user.service')

//PATH localhost:<port>/users/test
router.get('/test', (req, res) => {
	res.send(service.test());
})

//Add an entry to the sample table to test this out
router.get('/db/test', (req, res) => {
	service.get_sample()
		.then(samples => {
			res.send(samples)
		})
		.catch(err => {
			res.send(err)
		})
})

router.get('/', (req, res) => {
	service.get_all()
		.then(applicants => {
			res.send(applicants)
		})
		.catch(err => {
			res.send(err)
		})
})

router.get('/:id', (req, res) => {
	service.get(req.params.id)
		.then(applicant => {
			res.send(applicant)
		})
		.catch(err => {
			res.send(err)
		})
})

router.post('/', (req, res) => {
	service.add(
		req.body.id_number,
		req.body.first_name,
		req.body.last_name,
		req.body.year,
		req.body.course,
		req.body.block,
		req.body.is_new_member,
		req.body.id_pic_link,
		req.body.mobile_number,
		req.body.email,
		req.body.interview_sched
	)
		.then(add_res => {
			res.send(add_res)
		})
		.catch(err => {
			res.send(err)
		})
})

router.put('/:id', (req, res) => {
	service.update(
		req.params.id,
		req.body.id_number,
		req.body.first_name,
		req.body.last_name,
		req.body.year,
		req.body.course,
		req.body.block,
		req.body.is_new_member,
		req.body.id_pic_link,
		req.body.mobile_number,
		req.body.email,
		req.body.interview_sched
	)
		.then(update_res => {
			res.send(update_res)
		})
		.catch(err => {
			res.send(err)
		})
})

router.delete('/:id', (req, res) => {
	service.delete(req.params.id)
		.then(delete_res => {
			res.send(delete_res)
		})
		.catch(err => {
			res.send(err)
		})
})

module.exports = router