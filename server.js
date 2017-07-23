//PACKAGES
var express = require('express')
var localtunnel = require('localtunnel')

//VARIABLES AND PARAMETERS
const port = 5000

var app = express()
var users = require('./app/users/index.js')
var db_init = require('./app/db/init.js')

var tunnel = localtunnel(port, {subdomain: 'levylocal'}, (err, tunnel) => {
	if(err) {
		console.log(err)
	}
	console.log('localhost accessible via localtunnel link:', tunnel.url);
	tunnel.url
})


//APP Imports
app.use('/users', users);
// app.use('/db', db_init);

//MISC
app.listen(port);
console.log('App running in port:', port);

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