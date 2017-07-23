//PACKAGES
var express = require('express')
var app = express()
var localtunnel = require('localtunnel')

//VARIABLES AND PARAMETERS
const port = 5000
var tunnel = localtunnel(port, {subdomain: 'levylocal'}, (err, tunnel) => {
	if(err) {
		console.log(err)
	}
	console.log('localhost accessible via localtunnel link:', tunnel.url);
	tunnel.url
})

//ROUTES
app.get ('/', (req, res) => {
	res.send('Hello World');
})

//MISC
app.listen(port);
console.log('App running in port:', port);