var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/quodo", { native_parser: true });
db.bind('courses');

var service = {};

service.create = create;
service.update = update;
service.delete = _delete;
service.getAll = getAll;
service.getById = getById;

module.exports = service;

function create(courseParam) {
    var deferred = Q.defer();
    createCourse();

    function createCourse() {
        var course = _.omit(courseParam, '');

        db.courses.insert(course, function (err, doc) {
            if (err) { deferred.reject(err.name + ': ' + err.message); }
			var id = doc["ops"][0]["_id"];
			course._id = id;					
			deferred.resolve(_.omit(course, ''));
        });
    }

    return deferred.promise;
}

function update(_id, courseParam) {
    var deferred = Q.defer();
	if(courseParam["_id"]) {
		delete courseParam["_id"];
	}
	
	updateCourse();

    function updateCourse() {		
        db.courses.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: courseParam },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.courses.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}

function getAll() {
    var deferred = Q.defer();

    db.courses.find().toArray(function (err, courses) {
        if (err) deferred.reject(err.name + ': ' + err.message);
		
        courses = _.map(courses, function (course) {
            return _.omit(course, '');
        });

        deferred.resolve(courses);
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.courses.findOne({ _id: mongo.helper.toObjectID(_id) }, function (err, course) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (course) {
            deferred.resolve(_.omit(course, ''));
        } else {
            deferred.resolve();
        }
    });

    return deferred.promise;
}