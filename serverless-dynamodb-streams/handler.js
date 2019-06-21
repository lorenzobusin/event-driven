'use strict';

const AWS = require('aws-sdk');
//const s3 = new AWS.S3();
const SQS = new AWS.SQS();


module.exports.createUser = (event, context, callback) => {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const body = event.Records[0].body.toString('utf-8'); //read new event body from SQS
  const bodyParsed = JSON.parse(body);
  console.log("body: ", bodyParsed);

  const userParam = {
    "userId":  bodyParsed.userId,
    "firstName": bodyParsed.firstName,
    "lastName": bodyParsed.lastName, 
    "username": bodyParsed.username
  };

  const params = {
    TableName: 'users',
    Item: userParam
  };

  return dynamoDb.put(params, (error, data) => {
    if (error) {
      callback(error);
    }
    callback(null, { message: 'User successfully created', params });
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

module.exports.uploadEventToSQS = (event, context, callback) => {

  console.log("EVENTO: " + JSON.stringify(event));
  /*var params = {
    Bucket: 'serverless-bucket-s3-public', 
    Key: 'event.json', 
    Body: JSON.stringify(txt, null, 2)
  };

  s3.upload(params, function(err, data) {
    if (err) 
      return err;
    callback(null, { message: 'Event successfully uploaded', params });
  });*/

 // const body = event.Records[0].body.toString('utf-8'); //read new event body from SQS
 // const bodyParsed = JSON.parse(body);
 // console.log("body: ", bodyParsed);

  var params = {
   // MessageBody: JSON.stringify(event),
    MessageBody: JSON.stringify(event),
    QueueUrl: "https://sqs.eu-central-1.amazonaws.com/582373673306/eventQueue"
  };

  SQS.sendMessage(params, function(err,data){
    if(err) {
      callback(err);
    }else{
      callback(null, { message: 'Event successfully put in SQS', params });
    }
  });
};


