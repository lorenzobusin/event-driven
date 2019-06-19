'use strict';

const AWS = require('aws-sdk');
const s3 = new AWS.S3();


module.exports.createUser = (event, context, callback) => {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  var txt = {
    "userId":  "1",
    "firstName": "ciao",
    "lastName": "ciao", 
    "username": "ciao"
  };

  var writeParams = {
    Bucket: 'serverless-bucket-s3-public', 
    Key: 'testEvent.json', 
    Body: JSON.stringify(txt, null, 2)
  }

  s3.upload(writeParams, function(err, data) {
    if (err) 
      return err;
    console.log(`File uploaded successfully at ${data.Location}`)
  });

  var getParams = {
    Bucket: 'serverless-bucket-s3-public', // your bucket name,
    Key: 'event.json' // path to the object you're looking for
  }
  s3.getObject(getParams, function(err, data) {
    if (err)
        return err;

  var eventFile = data.Body.toString('utf-8');
  
  var obj = JSON.parse(eventFile);
  var objToPut = {
    "userId":  obj.userId,
    "firstName": obj.firstName,
    "lastName": obj.lastName, 
    "username": obj.username
  };

  const params = {
    TableName: 'users',
    Item: objToPut
  };

  return dynamoDb.put(params, (error, data) => {
    if (error) {
      callback(error);
    }
    callback(null, { message: 'User successfully created', params });
  });

  });

};

module.exports.getUser = (event, context, callback) => {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: 'users',
    ProjectionExpression:"userId, firstName, lastName, username",
    KeyConditionExpression: "userId = :id",
    ExpressionAttributeValues: {
        ":id": event.userId
    }
  };

  return dynamoDb.query(params, (error, data) => {
    if (error) {
      callback(error);
    }
      let response = data.Items[0];
      callback(null, response);
    });
};

module.exports.updateUser = (event, context, callback) => {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

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

module.exports.deleteUser = (event, context, callback) => {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: 'users',
    Key:{
      "id": event.id
    },
    KeyConditionExpression: "userId = :id",
    ExpressionAttributeValues: {
        ":id": event.userId
    }
  };

  return dynamoDb.delete(params, (error, data) => {
    if (error) {
      callback(error);
    }
    callback(null, { message: 'User successfully deleted', params });
    });
};


