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
			res.send(update_res)
		})
		.catch(err => {
			res.send(err)
		})
})
router.post('/remove/:applicant_id', (req, res) => {
	service.clear_timeslot(req.params.applicant_id)
		.then(clear_res => {
			res.send(clear_res)
		})
		.catch(err => {
			res.send(err)
		})
})
router.post('/schedules/generate', (req, res) => {
	service.generate()
		.then(seed_res => {
			res.send(seed_res)
		})
		.catch(err => {
			res.send(err)
		})
})

module.exports = router