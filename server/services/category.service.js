var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/quodo", { native_parser: true });
db.bind('categories');

var service = {};

service.create = create;
service.update = update;
service.delete = _delete;
service.getAll = getAll;
service.getById = getById;

module.exports = service;

function create(categoryParam) {
    var deferred = Q.defer();

    db.categories.findOne({ name: categoryParam.name }, function (err, category) {
        if (err) deferred.reject(err.name + ': ' + err.message);
		
        if (category) {
            deferred.reject('Email "' + categoryParam.name + '" is already taken');
        } else {
            createCategory();
        }
    });

    function createCategory() {
        var category = _.omit(categoryParam, '');

        db.categories.insert(category, function (err, doc) {
            if (err) { deferred.reject(err.name + ': ' + err.message); }
			var id = doc["ops"][0]["_id"];
			category._id = id;					
			deferred.resolve(_.omit(category, ''));
        });
    }

    return deferred.promise;
}

function update(_id, categoryParam) {
    var deferred = Q.defer();
	if(categoryParam["_id"]) {
		delete categoryParam["_id"];
	}
	
	updateCategory();

    function updateCategory() {		
        db.categories.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: categoryParam },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.categories.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}

function getAll() {
    var deferred = Q.defer();

    db.categories.find().toArray(function (err, categories) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        categories = _.map(categories, function (category) {
            return _.omit(category, '');
        });

        deferred.resolve(categories);
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.categories.findOne({ _id: mongo.helper.toObjectID(_id) }, function (err, category) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (category) {
            deferred.resolve(_.omit(category, ''));
        } else {
            deferred.resolve();
        }
    });

    return deferred.promise;
}