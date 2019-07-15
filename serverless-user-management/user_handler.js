module.exports.pushCreateUserToSQS = (event, context, callback) => {
  const AWS = require('aws-sdk');
  const SQS = new AWS.SQS();
  const stringedEvent = JSON.stringify(event);

  const params = {
    MessageBody: stringedEvent,
    QueueUrl: "https://sqs.eu-central-1.amazonaws.com/582373673306/createUserQueue"
  };

  SQS.sendMessage(params, function(err,data){
    if(err){
      console.log(err);
      callback(null, err);
    }
    else
      callback(null, "User event pushed to SQS") 
  });
};

module.exports.pushUpdateUserToSQS = (event, context, callback) => {
  const AWS = require('aws-sdk');
  const SQS = new AWS.SQS();
  const stringedEvent = JSON.stringify(event);

  const params = {
    MessageBody: stringedEvent,
    QueueUrl: "https://sqs.eu-central-1.amazonaws.com/582373673306/updateUserQueue"
  };

  SQS.sendMessage(params, function(err,data){
    if(err){
      console.log(err);
      callback(null, err);
    }
    else
      callback(null, "User event pushed to SQS")
  });
};

module.exports.pushDeleteUserToSQS = (event, context, callback) => {
  const AWS = require('aws-sdk');
  const SQS = new AWS.SQS();
  const stringedEvent = JSON.stringify(event);

  const params = {
    MessageBody: stringedEvent,
    QueueUrl: "https://sqs.eu-central-1.amazonaws.com/582373673306/deleteUserQueue"
  };

  SQS.sendMessage(params, function(err,data){
    if(err){
      console.log(err);
      callback(null, err);
    }
    else
      callback(null, "User event pushed to SQS")
  });
};

module.exports.commandCreateUser = async (event, context, callback) => {
  const utils = require('./utils.js');

  const stringedEvent = event.Records[0].body.toString('utf-8'); //read new event from SQS
  const eventParsed = JSON.parse(stringedEvent);
  const stringedBody = JSON.stringify(eventParsed);
  const bodyParsed = JSON.parse(stringedBody);
  const check = bodyParsed.body;

  const checkEmailParams = {
    TableName: 'user',
    ProjectionExpression: "email",
    FilterExpression: "email = :checkEmail",
    ExpressionAttributeValues: {
        ":checkEmail": check.email
    }
  };

  const emailAlreadyExists = await utils.asyncCheckScanDB(checkEmailParams);
  
  if((check.userId == "" || check.firstName == "" || check.lastName == "" || check.date == "" || check.role == "" || check.group == "") || (emailAlreadyExists) || (!utils.validateEmail(check.email)) || (!utils.validatePassword(check.password))){
    callback(null, "Email already exists or empty attributes");
  }
  else{
    bodyParsed.body.password = utils.encrypt(bodyParsed.body.password);
    utils.storeEvent("user", "executeCreateUserQueue", bodyParsed.body);
    callback(null, "User event stored");
  }
};

module.exports.commandUpdateUser = async (event, context, callback) => {
  const utils = require('./utils.js');

  const stringedEvent = event.Records[0].body.toString('utf-8'); //read new event from SQS
  const eventParsed = JSON.parse(stringedEvent);
  const stringedBody = JSON.stringify(eventParsed);
  const bodyParsed = JSON.parse(stringedBody);
  const check = bodyParsed.body;

  const checkEmailParams = {
    TableName: 'user',
    ProjectionExpression: "email",
    FilterExpression: "email = :checkEmail",
    ExpressionAttributeValues: {
        ":checkEmail": check.email
    }
  };

  const emailAlreadyExists = await utils.asyncCheckScanDB(checkEmailParams);
  
  if((check.userId == "" || check.firstName == "" || check.lastName == "" || check.date == "" || check.role == "" || check.group == "") || (emailAlreadyExists) || (!utils.validateEmail(check.email)) || (!utils.validatePassword(check.password))){
    callback(null, "Email already exists or empty attributes");
  }
  else{
    bodyParsed.body.password = utils.encrypt(bodyParsed.body.password);
    utils.storeEvent("user", "executeUpdateUserQueue", bodyParsed.body);
    callback(null, "User event stored");
  }
};

module.exports.commandDeleteUser = (event, context, callback) => {
  const utils = require('./utils.js');

  const stringedEvent = event.Records[0].body.toString('utf-8'); //read new event from SQS
  const eventParsed = JSON.parse(stringedEvent);
  const stringedBody = JSON.stringify(eventParsed);
  const bodyParsed = JSON.parse(stringedBody);
  const check = bodyParsed.body;
  
  if(check.userId == "" )
    callback(null, "Empty attribute");
  else{
    utils.storeEvent("user", "executeDeleteUserQueue", bodyParsed.body);
    callback(null, "User event stored");
  }
};

module.exports.createUser = (event, context, callback) => {
  const AWS = require('aws-sdk');
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const stringedBody = event.Records[0].body.toString('utf-8');
  const parsedBody = JSON.parse(stringedBody);

  const params = {
    TableName: 'user',
    Item: parsedBody
  };

  dynamoDb.put(params, (err, data) => {
    if (err){
      console.log(err);
      callback(null, err);
    }
    else
      callback(null, "User created");
  });
};

module.exports.updateUser = (event, context, callback) => {
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
    UpdateExpression: "set firstName = :fn, lastName=:ln, #birthdate=:d, #userrole=:r, #usergroup=:g, email=:e, password=:p",
    ExpressionAttributeValues:{
        ":fn": parsedBody.firstName,
        ":ln": parsedBody.lastName,
        ":d": parsedBody.date,
        ":r": parsedBody.role,
        ":g": parsedBody.group,
        ":e": parsedBody.email,
        ":p": parsedBody.password
    }   
  };

  dynamoDb.update(params, (err, data) => {
    if (err){
      console.log(err);
      callback(null, err);
    }
    else  
      callback(null, "User updated");
  });
};

module.exports.deleteUser = (event, context, callback) => {
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

  dynamoDb.delete(params, (err, data) => {
    if (err){
      console.log(err);
      callback(null, err);
    }
    else
      callback(null, "User deleted")
  });
};

//READ MODE LAMBDA

module.exports.readUser = (event, context, callback) => {
  const AWS = require('aws-sdk');
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const stringedEvent = JSON.stringify(event);
  const parsedEvent = JSON.parse(stringedEvent);

  const params = {
    TableName: 'user',
    Key: {
      "userId": parsedEvent.userId
    },
    ExpressionAttributeNames:{
      "#birthdate": "date", //date is a reserved keyword
      "#userrole": "role", //role is a reserved keyword
      "#usergroup": "group" //group is a reserved keyword
    },
    ProjectionExpression: "firstName, lastName, #birthdate, #userrole, #usergroup, email",
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
        console.log("User not found");
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
        console.log("User successfully read");
        callback(null, response);
      }      
    }
  });
};



