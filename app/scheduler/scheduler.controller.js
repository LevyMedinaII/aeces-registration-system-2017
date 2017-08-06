var router = require('express').Router()
var service = require('./scheduler.service')

router.get('/schedules', (req, res) => {
	service.get_all()
		.then(schedules => {
			res.send(schedules)
		})
		.catch(err => {
			res.send(err)
		})
})
router.put('/', (req, res) => {
	service.schedule_applicant(req.body.date, req.body.timeslot, req.body.applicant_id)
		.then(update_res => {
			console.log('Res:', update_res)
			res.send(update_res)
		})
		.catch(err => {
			res.send(err)
		})
})
router.post('/schedules/seed', (req, res) => {
	service.seed()
		.then(seed_res => {
			res.send(seed_res)
		})
		.catch(err => {
			res.send(err)
		})
})

module.exports = router