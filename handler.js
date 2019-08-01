'use strict';

const config = require('./config/config');
const response = require('./util/response');

const Service = require('./services/service');

const service = new Service();

module.exports = {
  create,
  hello,
  list,
  stream
};

async function create(event, context, callback) {
  try {
    const json = JSON.parse(event.body);
    const result = await service.createTask(json);
    callback(null, response.ok({ data: result }));
  } catch (err) {
    callback(err, response.serverError(err));
  }
}

async function hello(event, context, callback) {
  try {
    const result = await service.doSomething();
    callback(null, response.ok({ data: result }));
  } catch (err) {
    callback(err, response.serverError(err));
  }
}

async function list(event, context, callback) {
  try {
    const result = await service.listTasks();
    callback(null, response.ok({ data: result }));
  } catch (err) {
    callback(err, response.serverError(err));
  }
}

function stream(event, context, callback) {
  event.Records.forEach(function(record) {
    console.log('SLUGIFY event', record);
    console.log('SLUGIFY record', record.dynamodb);
    if (record.eventName === 'INSERT') {
      service.updateTask({
        id: record.dynamodb.Keys.id.S,
        name: record.dynamodb.NewImage.name.S
      }, function(err, res) {
        if (err) { return console.error('SLUGIFY INSERT ERR', err); }
        console.log('SLUGIFY INSERT result', res);
      });
    }
  });

  return callback(null, `Successfully processed ${event.Records.length} records.`);
}
