'use strict';

const AWS = require('aws-sdk');
const SQS = new AWS.SQS();
const LAMBDA = new AWS.Lambda();
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.mediator = (event, context, callback) => {

  const body = event.Records[0].body.toString('utf-8'); //read new event body from SQS
  const bodyParsed = JSON.parse(body);
  const userParams = {
    "userId": bodyParsed.userId,
    "firstName": bodyParsed.firstName,
    "lastName": bodyParsed.lastName,
    "username": bodyParsed.username
  };

  switch(bodyParsed.typeEvent){
    case("C"): {
      console.log("Event type: CREATE");
      var params = {
        FunctionName: "serverless-dynamodb-streams-dev-createUser", 
        InvocationType: "Event", 
        LogType: "Tail", 
        Payload: JSON.stringify(userParams) //only string type
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

   /* case("R"): {
      console.log("Event type: READ");
      var params = {
        FunctionName: "serverless-dynamodb-streams-dev-getUser", 
        InvocationType: "Event", 
        LogType: "Tail", 
        Payload: JSON.stringify(userParams) //only string type
       };

       LAMBDA.invoke(params, function(err, data) {
        if (err) {
          console.log(err);
        } else {
          console.log('Payload sending...');
        }
      });
    }
    break;*/

    case("U"): {
      console.log("Event type: UPDATE");
      var params = {
        FunctionName: "serverless-dynamodb-streams-dev-updateUser", 
        InvocationType: "Event", 
        LogType: "Tail", 
        Payload: JSON.stringify(userParams) //only string type
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

    case("D"): {
      console.log("Event type: DELETE");
      var params = {
        FunctionName: "serverless-dynamodb-streams-dev-deleteUser", 
        InvocationType: "Event", 
        LogType: "Tail", 
        Payload: JSON.stringify(userParams) //only string type
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

  const params = {
    TableName: 'users',
    Item: event
  };

  dynamoDb.put(params, (error, data) => {
    if (error)
      console.log(error);
    else
    console.log('User successfully created');
  });

};

module.exports.readUser = (event, context, callback) => {

  const stringedEvent = JSON.stringify(event);
  const parsedEvent = JSON.parse(stringedEvent);

  const params = {
    TableName: 'users',
    Key: {
      "userId": parsedEvent.userId
    },
    ProjectionExpression:"userId, firstName, lastName, username",
    KeyConditionExpression: "userId = :id",
    ExpressionAttributeValues: {
        ":id": parsedEvent.userId
    }
  };

  dynamoDb.get(params, (err, data) => {
    const stringedData = JSON.stringify(data);
    if (err)
      console.log(err);
    else{
      if(data == "")
        console.log("User not found");
      else{
        const response = {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
          },
          body: stringedData
        };
        console.log("User successfully read");
        callback(null, response);
      }      
    }
  });
};

module.exports.updateUser = (event, context, callback) => {

  const stringedEvent = JSON.stringify(event);
  const parsedEvent = JSON.parse(stringedEvent);

  const params = {
    TableName: 'users',
    Key: {
      "userId":  parsedEvent.userId
    },
    UpdateExpression: "set firstName = :fn, lastName=:ln, username=:u",
    ExpressionAttributeValues:{
        ":fn": parsedEvent.firstName,
        ":ln": parsedEvent.lastName,
        ":u": parsedEvent.username
    }   
  };

  dynamoDb.update(params, (err, data) => {
    if (err)
      console.log(err);
    else
      console.log('User successfully updated');
  });
};

module.exports.deleteUser = (event, context, callback) => {

  const stringedEvent = JSON.stringify(event);
  const parsedEvent = JSON.parse(stringedEvent);
  
  const params = {
    TableName: 'users',
    Key:{
      "userId": parsedEvent.userId
    },
    ConditionExpression:"userId = :val",
    ExpressionAttributeValues: {
        ":val": parsedEvent.userId
    }
  };

  dynamoDb.delete(params, (err, data) => {
    if (err)
      console.log(err);
    else
    console.log('User successfully deleted');
    });
};

module.exports.pushEventUserToSQS = (event, context, callback) => {

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



