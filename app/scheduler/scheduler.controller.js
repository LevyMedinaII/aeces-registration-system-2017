var router = require('express').Router()
var service = require('./scheduler.service')

router.get('/schedules', (req, res) => {
	service.get_all()
		.then(schedules => {
			res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8080')
			res.send(schedules)
		})
		.catch(err => {
			res.send(err)
		})
})
router.get('/schedules/free', (req, res) => {
	service.get_all_free()
		.then(schedules => {
			res.send(schedules)
		})
		.catch(err => {
			res.send(err)
		})
})
router.get('/applicants/:id_number', (req, res) => {
	service.find_schedule(req.params.id_number)
		.then(schedule => {
			res.send(schedule)
		})
		.catch(err => {
			res.send(err)
		})
})
router.post('/remove/:id_number', (req, res) => {
	service.clear_timeslot(req.params.id_number)
		.then(clear_res => {
			res.send(clear_res)
		})
		.catch(err => {
			res.send(err)
		})
})
router.post('/schedules/generate', (req, res) => {
	service.generate()
		.then(generate_res => {
			res.send(generate_res)
		})
		.catch(err => {
			res.send(err)
		})
})
router.put('/', (req, res) => {
	service.schedule_applicant(req.body.date, req.body.timeslot, req.body.applicant_id_number)
		.then(update_res => {
			res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8080')
			res.send(update_res)
		})
		.catch(err => {
			res.send(err)
		})
})

module.exports = router
