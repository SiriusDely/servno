'use strict';

const config = require('./config/config');
const response = require('./util/response');

const Service = require('./services/service');

const service = new Service();

module.exports = {
  create,
  hello
};

async function create(event, context, callback) {
  try {
    const json = JSON.parse(event.body);
    const result = await service.createTask(json);
    callback(null, response.ok({ data: result }));
  } catch(err) {
    callback(err, response.serverError(err));
  }
}

async function hello(event, context, callback) {
  try {
    const result = await service.doSomething();

    callback(null, response.ok({ data: result }));
  } catch(err) {
    callback(err, response.serverError(err));
  }
}
