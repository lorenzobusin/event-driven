module.exports.pushCreateUserToSQS = async (event, context, callback) => {
  const utils = require('./utils.js');

  const params = {
    MessageBody: JSON.stringify(event),
    QueueUrl: "https://sqs.eu-central-1.amazonaws.com/582373673306/createUserQueue"
  };

  const res = await utils.pushToSQS(params);
  callback(null, res);
};

module.exports.pushUpdateUserToSQS = async (event, context, callback) => {
  const utils = require('./utils.js');

  const params = {
    MessageBody: JSON.stringify(event),
    QueueUrl: "https://sqs.eu-central-1.amazonaws.com/582373673306/updateUserQueue"
  };

  const res = await utils.pushToSQS(params);
  callback(null, res);
};

module.exports.pushDeleteUserToSQS = async (event, context, callback) => {
  const utils = require('./utils.js');

  const params = {
    MessageBody: JSON.stringify(event),
    QueueUrl: "https://sqs.eu-central-1.amazonaws.com/582373673306/deleteUserQueue"
  };

  const res = await utils.pushToSQS(params);
  callback(null, res);
};

module.exports.commandCreateUser = async (event, context, callback) => {
  const utils = require('./utils.js');

  const stringedEvent = event.Records[0].body.toString('utf-8'); //read new event from SQS
  const eventParsed = JSON.parse(stringedEvent);
  const stringedBody = JSON.stringify(eventParsed.body);
  const eventToCheck = JSON.parse(stringedBody);

  const checkIdParams = { //params to check for duplicated userId
    TableName: 'user',
    ProjectionExpression: "userId",
    FilterExpression: "userId = :checkId",
    ExpressionAttributeValues: {
        ":checkId": eventToCheck.userId
    }
  };

  const userIdAlreadyExists = await utils.asyncCheckScanDB(checkIdParams); //check for duplicated userId
  if(userIdAlreadyExists)
    callback(null, "userId already exists");

  const checkEmailParams = {  //params to check for duplicated email
    TableName: 'user',
    ProjectionExpression: "email",
    FilterExpression: "email = :checkEmail",
    ExpressionAttributeValues: {
        ":checkEmail": eventToCheck.email
    }
  };

  const emailAlreadyExists = await utils.asyncCheckScanDB(checkEmailParams); //check for duplicated email
  if(emailAlreadyExists)
    callback(null, "Email already exists");
  
  if(eventToCheck.userId == "" ||eventToCheck.firstName == "" || eventToCheck.lastName == "" || eventToCheck.date == "" || eventToCheck.role == "" || eventToCheck.group == ""){ //check for empty attributes
    callback(null, "Empty attributes");
  }
  else{
    utils.storeEvent("user", "executeCreateUserQueue", eventToCheck); //store into eventStore
    callback(null, "User event stored");
  }
};

module.exports.commandUpdateUser = async (event, context, callback) => {
  const utils = require('./utils.js');

  const stringedEvent = event.Records[0].body.toString('utf-8'); //read new event from SQS
  const eventParsed = JSON.parse(stringedEvent);
  const stringedBody = JSON.stringify(eventParsed.body);
  var eventToCheck = JSON.parse(stringedBody);
  if(!eventToCheck.userId)
    eventToCheck = JSON.parse(eventToCheck);

  const checkIdParams = { //params to check if userId exists
    TableName: 'user',
    ProjectionExpression: "userId",
    FilterExpression: "userId = :checkId",
    ExpressionAttributeValues: {
        ":checkId": eventToCheck.userId
    }
  };
  
  const userIdExists = await utils.asyncCheckScanDB(checkIdParams); //check if userId exists
  if(!userIdExists)
    callback(null, "User not found");

  const checkEmailParams = { //params to check for duplicated email
    TableName: 'user',
    ProjectionExpression: "email, userId",
    FilterExpression: "email=:checkEmail and userId<>:checkUserId", //valid if the email not changed 
    ExpressionAttributeValues: {
        ":checkEmail": eventToCheck.email,
        ":checkUserId": eventToCheck.userId
    }
  };
  
  const emailAlreadyExists = await utils.asyncCheckScanDB(checkEmailParams); //check for duplicated email
  if (emailAlreadyExists)
    callback(null, "Email already exists")
  
  if(eventToCheck.userId == "" || eventToCheck.firstName == "" || eventToCheck.lastName == "" || eventToCheck.date == "" || eventToCheck.role == "" || eventToCheck.group == ""){ //check for empty attributes
    callback(null, "Empty attributes");
  }
  else{
    utils.storeEvent("user", "executeUpdateUserQueue", eventToCheck); //store into eventStore
    callback(null, "User event stored");
  }
};

module.exports.commandDeleteUser = async (event, context, callback) => {
  const utils = require('./utils.js');

  const stringedEvent = event.Records[0].body.toString('utf-8'); //read new event from SQS
  const eventParsed = JSON.parse(stringedEvent);
  const stringedBody = JSON.stringify(eventParsed.body);
  const eventToCheck = JSON.parse(stringedBody);

  const checkIdParams = { //params to check if userId exists
    TableName: 'user',
    ProjectionExpression: "userId",
    FilterExpression: "userId = :checkId",
    ExpressionAttributeValues: {
        ":checkId": eventToCheck.userId
    }
  };

  const userIdExists = await utils.asyncCheckScanDB(checkIdParams); //check if userId exists
  
  if(!userIdExists) 
    callback(null, "User not found");
  else{
    utils.storeEvent("user", "executeDeleteUserQueue", eventToCheck); //store into eventStore
    callback(null, "User event stored");
  }
};

module.exports.createUser = async (event, context, callback) => {
  const AWS = require('aws-sdk');
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const stringedBody = event.Records[0].body.toString('utf-8');
  const parsedBody = JSON.parse(stringedBody);

  const params = {
    TableName: 'user',
    Item: parsedBody
  };

  await dynamoDb.put(params, (err, data) => {
    if (err){
      console.log(err);
      callback(null, err);
    }
    else
      callback(null, "User created");
  }).promise();
};

module.exports.updateUser = async (event, context, callback) => {
  const AWS = require('aws-sdk');
  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  

  const stringedBody = event.Records[0].body.toString('utf-8');
  const parsedBody = JSON.parse(stringedBody);

  const params = {
    TableName: 'user',
    Key: {
      "userId":  parsedBody.userId
    },
    ExpressionAttributeNames:{
      "#birthdate": "date", //date is a reserved keyword
      "#userrole": "role", //role is a reserved keyword
      "#usergroup": "group" //group is a reserved keyword
    },
    UpdateExpression: "set firstName = :fn, lastName=:ln, #birthdate=:d, #userrole=:r, #usergroup=:g, email=:e",
    ExpressionAttributeValues:{
        ":fn": parsedBody.firstName,
        ":ln": parsedBody.lastName,
        ":d": parsedBody.date,
        ":r": parsedBody.role,
        ":g": parsedBody.group,
        ":e": parsedBody.email
    }   
  };

  await dynamoDb.update(params, (err, data) => {
    if (err){
      console.log(err);
      callback(null, err);
    }
    else  
      callback(null, "User updated");
  }).promise();
};

module.exports.deleteUser = async (event, context, callback) => {
  const AWS = require('aws-sdk');
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const stringedBody = event.Records[0].body.toString('utf-8');
  const parsedBody = JSON.parse(stringedBody);
  
  const params = {
    TableName: 'user',
    Key:{
      "userId": parsedBody.userId
    },
    ConditionExpression:"userId = :val",
    ExpressionAttributeValues: {
        ":val": parsedBody.userId
    }
  };

  await dynamoDb.delete(params, (err, data) => {
    if (err){
      console.log(err);
      callback(null, err);
    }
    else
      callback(null, "User deleted")
  }).promise();
};

//READ MODE LAMBDA
module.exports.readUser = (event, context, callback) => {
  const AWS = require('aws-sdk');
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const stringedEvent = JSON.stringify(event);
  const parsedEvent = JSON.parse(stringedEvent);

  const params = { //get user by userId
    TableName: 'user',
    Key: {
      "userId": parsedEvent.userId
    },
    KeyConditionExpression: "userId = :id",
    ExpressionAttributeValues: {
        ":id": parsedEvent.userId
    }
  };

  dynamoDb.get(params, (err, data) => {
    const stringedData = JSON.stringify(data);
    if (err){
      console.log(err);
      callback(null, err);
    }
    else{
      if(data.Count == 0){
        callback(null, "User not found");
      }
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
        callback(null, response);
      }      
    }
  });
};


//USER APP
//these functions are only accessed by users from the user application, so they will be protected by an user_authorizer 
module.exports.pushSigninUserToSQS = async (event, context, callback) => { //signin into user app the first time
  const utils = require('./utils.js');
  
  const stringedEvent = JSON.stringify(event);
  const parsedEvent = JSON.parse(stringedEvent);

  const params = {
    MessageBody: JSON.stringify(parsedEvent),
    QueueUrl: "https://sqs.eu-central-1.amazonaws.com/582373673306/createUserQueue"
  };

  const res = await utils.pushToSQS(params);
  callback(null, res);
};

module.exports.pushUpdateProfileToSQS = async (event, context, callback) => {
  const utils = require('./utils.js');
  
  const stringedEvent = JSON.stringify(event);
  const parsedEvent = JSON.parse(stringedEvent);

  const params = {
    MessageBody: JSON.stringify(parsedEvent),
    QueueUrl: "https://sqs.eu-central-1.amazonaws.com/582373673306/updateUserQueue"
  };

  const res = await utils.pushToSQS(params);
  callback(null, res);
};

module.exports.getProfileInfo = (event, context, callback) => {
  const AWS = require('aws-sdk');
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const stringedEvent = JSON.stringify(event);
  const parsedEvent = JSON.parse(stringedEvent);

  const params = {
    TableName: 'user',
    Key: {
      "userId": parsedEvent.userId
    },
    KeyConditionExpression: "userId = :id",
    ExpressionAttributeValues: {
        ":id": parsedEvent.userId
    }
  };

  dynamoDb.get(params, (err, data) => {
    const stringedData = JSON.stringify(data);
    if (err){
      console.log(err);
      callback(null, err);
    }
    else{
      if(data.Count == 0){
        callback(null, "User not found");
      }
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
        callback(null, response);
      }      
    }
  });
};

