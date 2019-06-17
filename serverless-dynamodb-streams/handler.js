'use strict';

const AWS = require('aws-sdk');

module.exports.updateUser = (event, context, callback) => {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const data = event;
  data.updatedAt = new Date().getTime();

  const params = {
    TableName: 'users',
    Item: data
  };

  return dynamoDb.put(params, (error, data) => {
    if (error) {
      callback(error);
    }
    callback(null, { message: 'User successfully updated', params });
  });
};

module.exports.createUser = (event, context, callback) => {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const data = event;
  data.updatedAt = new Date().getTime();

  const params = {
    TableName: 'users',
    Item: data
  };

  return dynamoDb.put(params, (error, data) => {
    if (error) {
      callback(error);
    }
    callback(null, { message: 'User successfully created', params });
  });
};

module.exports.deleteUser = (event, context, callback) => {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const data = event;
  data.updatedAt = new Date().getTime();

  const params = {
    TableName: 'users',
    Key:{
      "id": event.id
    },
  };

  return dynamoDb.delete(params, (error, data) => {
    if (error) {
      callback(error);
    }
    callback(null, { message: 'User successfully deleted', params });
    });
};

module.exports.getUser = (event, context, callback) => {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const data = event;
  data.updatedAt = new Date().getTime();

  const params = {
    TableName: 'users',
    Key:{
      "id": event.id
    },
  };

  return dynamoDb.get(params, (error, data) => {
    if (error) {
      callback(error);
    }
      callback(null, { message: 'User: ', params });
    });
};

module.exports.logger = (event, context, callback) => {
  // print out the event information on the console (so that we can see it in the CloudWatch logs)
  console.log(`The following happend in the DynamoDB database table "users":\n${JSON.stringify(event.Records[0].dynamodb, null, 2)}`);

  callback(null, { event });
};
