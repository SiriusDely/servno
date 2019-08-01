'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const Model = require('../models/model');
const Task = require('../models/task');

function Service(opts) {
  Object.assign(this, opts);
}

module.exports = Service;

Service.prototype = {
  createTask,
  doSomething,
  listTasks
};

function createTask(data) {
  return Promise.resolve(
    new Task(data)
  ).then(function(task) {
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Item: task
    };

    return new Promise(function(resolve) {
      dynamoDb.put(params, function(err) {
        if (err) { throw err; }
        resolve(task);
      });
    });
  });
}

function doSomething() {
  return Promise.resolve(
    new Model({ key: 'hello', value: 'world' })
  );
}

function listTasks() {
  return new Promise(function(resolve) {
    const params = {
      TableName: process.env.DYNAMODB_TABLE
    };

    dynamoDb.scan(params, function(err, res) {
      if (err) { throw err; }
      resolve(res.Items);
    });
  });
}
