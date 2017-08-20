/*
 	* This is the main server file
 	* This will be ran when executing the script "npm start" in the command line
 	* Code Explanation:
	*	We imported the ff node_modules as usable variables using ES6 JS Syntax:
 	*		express
 	*		service
 	*		localtunnel
 	*	We declared and instantiated important variables
 	*		app is an instance of the express node_module
 	*		port is the port that the application will use
 	*		users imports the default export of the /users/index.js file
 	*		tunnel is an instance of localtunnel
 	*			localtunnel allows our local server to be accessible via the internet
 	*			This is useful for webhooks, etc.
 	*		We then use the "use" method of app to import the API inside index.js
 				(check index.js and user.controller for more info on this)
 	*		We then use the "listen" method of app to run the server given the port variable
 	*	NOTE:
 	*		(params) => {
				function processes here...
	 		}
	*	This is ES6 Javascript Syntax for functions. It is very identical to ES5 syntax: function(params){ function processes here...}
	*	We call this a fat arrow function
*/

//PACKAGES
var express = require('express')
var bodyParser = require('body-parser')

//VARIABLES AND INSTANTIATIONS
const port = 5000
var cors = require('cors')
var app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.options('*', cors());
//APP Imports
var users = require('./app/users/index.js')
var db_init = require('./app/db/init.js')
var emailer = require('./app/emailer/index.js')
var scheduler = require('./app/scheduler/index.js')
var exporter = require('./app/db/exporter/index.js')

require('./app/db/init')
app.use('/users', users)
app.use('/emailer', emailer)
app.use('/scheduler', scheduler)
app.use('/exporter', exporter)


//MISC
app.listen(port)
console.log('App running in port:', port)
