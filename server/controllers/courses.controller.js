var config = require('config.json');
var express = require('express');
var router = express.Router();
var courseService = require('services/course.service');

// routes
router.post('/create', create);
router.put('/:_id', update);
router.delete('/:_id', _delete);
router.get('/', getAll);
router.get('/:_id', getCurrent);

module.exports = router;

function create(req, res) {
    courseService.create(req.body)
        .then(function (course) {
            if (course) {
                res.send(course);
                res.sendStatus(200);
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

function getAll(req, res) {
    courseService.getAll()
        .then(function (courses) {
            res.send(courses);
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrent(req, res) {
    courseService.getById(req.params._id)
        .then(function (course) {
            if (course) {
                res.send(course);
                res.sendStatus(200);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}