var config = require('config.json');
var express = require('express');
var router = express.Router();
var courseService = require('services/course.service');

// routes
router.post('/create', create);
router.get('/', getAll);
router.get('/:_id', getCurrent);
router.put('/:_id', update);
router.delete('/:_id', _delete);

module.exports = router;

function create(req, res) {
    courseService.create(req.body)
        .then(function (course) {
			if (course) {
                res.send(course);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAll(req, res) {
    courseService.getAll()
        .then(function (courses) {
            res.send(courses);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrent(req, res) {
    courseService.getById(req.course.sub)
        .then(function (course) {
            if (course) {
                res.send(course);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function update(req, res) {
    courseService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    courseService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}