'use strict';

const Joi = require('joi');
const uuid = require('uuid');

function Task(opts) {
  const validationError = Joi.validate(opts, {
    name: Joi.string().required()
  }).error;

  if (validationError !== null) {
    throw validationError;
  }

  return Object.assign(this, {
    id: uuid.v1(),
    name: opts.name
  });
}

module.exports = Task;
