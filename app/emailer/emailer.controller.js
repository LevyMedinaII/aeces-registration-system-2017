var router = require('express').Router()
var service = require('./emailer.service')
var nodemailer = require('nodemailer')

var emailer_creds = {
	email: process.env.gmail_email,
	password: process.env.gmail_password,
	name: 'Levy Medina II'
}

router.get('/email/all', (req, res) => {
	var user_id = req.params.user_id
	var subject = 'AECES Recweek Interview Schedule'
	var text = 'Hello World' //email text
	var html = 'HTML Body'	//email html text

	// create reusable transporter object using the default SMTP transport
	var transporter = nodemailer.createTransport({
	    host: 'smtp.gmail.com',
	    port: 465,
	    secure: true, // secure:true for port 465, secure:false for port 587
	    auth: {
	        user: emailer_creds.email,
	        pass: emailer_creds.password
	    }
	})

	service.get_applicants_email()
		.then(emails_string => {
			console.log('Recipients:', emails_string)
			var mail_options = {
			    from: `"${emailer_creds.name}" <${emailer_creds.email}>`, // sender address
			    to: `${emails_string}`, // list of receivers
			    subject, text
			}

			// verify connection
			transporter.verify()
				.then(result => {
					console.log('Verification Result:', result)
				})
				.catch(err => {
					console.log('Verification Error:', err)
				})

			// send mail with defined transport object
			transporter.sendMail(mail_options, (error, info) => {
			    if (error) {
			        console.log(error)
			        res.send(error)
			    }
			    console.log(`Message sent: \n Message_ID: ${info.messageId} \n Response: ${info.response}`)
			    res.send(`Message sent: \n Message_ID: ${info.messageId} \n Response: ${info.response}`)
			})
		})
		.catch(err => {
			res.send(err)
		})
	
})

module.exports = router