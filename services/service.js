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
  listTasks,
  updateTask
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

function updateTask(data, callback) {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: data.id
    },
    ExpressionAttributeValues: {
      ':slug': data.name.trim().toLowerCase()
        .replace(/[^\w ]+/g,'')
        .replace(/ +/g,'-')   // simple approach
    },
    UpdateExpression: 'SET slug = :slug',
    ReturnValues: 'ALL_NEW'
  };

  dynamoDb.update(params, function(err, res) {
    callback(err, res);
  });
}
