var config = require('config.json');
var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var userService = require('services/user.service');

// routes
router.post('/login', authenticate);
router.post('/register', register);
router.get('/', getAll);
router.get('/:_id', getCurrent);
router.put('/:_id', update);
router.delete('/:_id', _delete);

module.exports = router;

function sendEmail(userMail, userId) {
	var transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: 'martin24989@gmail.com',
			pass: 'Harlekin89'
		}
	});

	var mailOptions = {
		from: 'martin24989@gmail.com',
		to: userMail,
		subject: 'Naboo Account', 
		text: '', 
		html: '<p>Welcome to Naboo, the worlds most famous plattform for creative courses. Please click the link below to activate your account.</p><br><a href="http://localhost:3002/user_confirmation/' + userId + '">http://localhost:3002/user_confirmation/' + userId + '</a>' 
	};

	transporter.sendMail(mailOptions, function(error, info){
		if(error){
			console.log(error);
		}else{
			console.log('Message sent: ' + info.response);
		};
	});
}

function authenticate(req, res) {
    userService.authenticate(req.body.email, req.body.password)
        .then(function (user) {	
			if (user) {
				res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function register(req, res) {
    userService.create(req.body)
        .then(function (user) {
			if (user) {
				res.send(user);
				sendEmail(req.body.email, user._id);
			} else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function update(req, res) {
    userService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    userService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAll(req, res) {
    userService.getAll()
        .then(function (users) {
            res.send(users);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrent(req, res) {
    userService.getById(req.user.sub)
        .then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}