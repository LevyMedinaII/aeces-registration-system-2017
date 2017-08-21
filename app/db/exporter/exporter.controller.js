var router = require('express').Router()
var service = require('./exporter.service')

router.get('/csv', (req, res) => {
	service.export_schedules()
		.then(written_values => {
			res.header('Access-Control-Allow-Origin', '*')
			res.send(written_values)
		})
		.catch(err => {
			res.send(err)
		})
})

module.exports = router
