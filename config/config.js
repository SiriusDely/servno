'use strict';

const requiredEnvVars = [
  'DYNAMODB_TABLE',
  'STREAM_ARN'
];

if (
  requiredEnvVars
  .map(envVarName => process.env[envVarName])
  .filter(envVar => envVar !== undefined).length < requiredEnvVars.length
) {
  throw new Error('Missing required env var');
}

module.exports = {
  dynamodbTable: process.env.DYNAMODB_TABLE,
  streamArn: process.env.streamArn
}
