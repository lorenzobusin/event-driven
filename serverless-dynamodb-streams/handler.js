'use strict';

const AWS = require('aws-sdk');
const SQS = new AWS.SQS();
const LAMBDA = new AWS.Lambda();

module.exports.mediator = (event, context, callback) => {

  const body = event.Records[0].body.toString('utf-8'); //read new event body from SQS
 // console.log("body: " + body);
  const bodyParsed = JSON.parse(body);

  switch(bodyParsed.typeEvent){
    case("C"): {
      console.log("Event type: CREATE");
      var params = {
        FunctionName: "serverless-dynamodb-streams-dev-createUser", 
        InvocationType: "Event", 
        LogType: "Tail", 
        Payload: body, 
        Qualifier: "1"
       };
    
       LAMBDA.invoke(params, function(err, data) {
        if (err) {
          console.log(err);
        } else {
          console.log('Payload sending...');
        }
      });
    }
      break;

    default:
      console.log("Undefined type event");
  }

};


module.exports.createUser = (event, context, callback) => {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const userParam = {
    "userId":  event.userId,
    "firstName": event.firstName,
    "lastName": event.lastName, 
    "username": event.username
  };

  const params = {
    TableName: 'users',
    Item: userParam
  };

  dynamoDb.put(params, (error, data) => {
    if (error)
      console.log(error);
    else
    console.log('User successfully created');
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

  var params = {
    MessageBody: JSON.stringify(event),
    QueueUrl: "https://sqs.eu-central-1.amazonaws.com/582373673306/eventQueue"
  };

  SQS.sendMessage(params, function(err,data){
    if(err) {
      console.log(err);
    }else{
      console.log('Event successfully put in SQS');
    }
  });
};


