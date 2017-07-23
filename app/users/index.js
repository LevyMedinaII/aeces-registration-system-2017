var user_controller = require('./user.controller')
module.exports = user_controller

/*
 	* This is the connection between the server and the users controller.
 	* Visualization:
 	* 	server.js <---> user.controller <---> user.service
 	* Code Explanation:
 	* 	We import the file user_controller as the variable user_controller
 	*		./	<-- means same directory as current file
 	*	We then export the variable user_controller as the default export for this file
 	*	This is then used when we import this file in server.js
*/