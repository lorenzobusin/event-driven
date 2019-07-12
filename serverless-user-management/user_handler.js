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
    utils.storeEvent("user", "serverless-user-management-dev-createUser", bodyParsed.body);
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
    utils.storeEvent("user", "serverless-user-management-dev-updateUser", bodyParsed.body);
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
    utils.storeEvent("user", "serverless-user-management-dev-deleteUser", bodyParsed.body);
    callback(null, "User event stored");
  }
};

module.exports.mediatorUser = (event, context, callback) => {
  const AWS = require('aws-sdk');
  const LAMBDA = new AWS.Lambda();
  const utils = require('./utils.js');

  const stringedEvent = JSON.stringify(event);
  const parsedEvent = JSON.parse(stringedEvent);

  switch(parsedEvent.typeEvent){
    case("C"): {
      const userParams = {
        "userId": parsedEvent.userId,
        "firstName": parsedEvent.firstName,
        "lastName": parsedEvent.lastName,
        "date": parsedEvent.date,
        "role": parsedEvent.role,
        "group": parsedEvent.group,
        "email": parsedEvent.email,
        "password": utils.encrypt(parsedEvent.password)
      };

      var params = {
        FunctionName: "serverless-user-management-dev-createUser", 
        InvocationType: "Event", 
        LogType: "Tail", 
        Payload: JSON.stringify(userParams) //only string type
       };

       LAMBDA.invoke(params, function(err, data) {
        if (err) 
          console.log(err);
      });
    }
    break;

    case("U"): {
      const userParams = {
        "userId": parsedEvent.userId,
        "firstName": parsedEvent.firstName,
        "lastName": parsedEvent.lastName,
        "date": parsedEvent.date,
        "role": parsedEvent.role,
        "group": parsedEvent.group,
        "email": parsedEvent.email,
        "password": utils.encrypt(parsedEvent.password)
      };

      var params = {
        FunctionName: "serverless-user-management-dev-updateUser", 
        InvocationType: "Event", 
        LogType: "Tail", 
        Payload: JSON.stringify(userParams) //only string type
       };

       LAMBDA.invoke(params, function(err, data) {
        if (err) 
          console.log(err);
      });
    }
    break;

    case("D"): {
      const userParams = {
        "userId": parsedEvent.userId
      };

      var params = {
        FunctionName: "serverless-user-management-dev-deleteUser", 
        InvocationType: "Event", 
        LogType: "Tail", 
        Payload: JSON.stringify(userParams) //only string type
      };

       LAMBDA.invoke(params, function(err, data) {
        if (err) 
          console.log(err);
      });
    }
    break;
    
    default:
      console.log("Undefined type event");
  }

};

module.exports.createUser = (event, context, callback) => {
  const AWS = require('aws-sdk');
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: 'user',
    Item: event
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

  const stringedEvent = JSON.stringify(event);
  const parsedEvent = JSON.parse(stringedEvent);

  const params = {
    TableName: 'user',
    Key: {
      "userId":  parsedEvent.userId
    },
    ExpressionAttributeNames:{
      "#birthdate": "date", //date is a reserved keyword
      "#userrole": "role", //role is a reserved keyword
      "#usergroup": "group" //group is a reserved keyword

    },
    UpdateExpression: "set firstName = :fn, lastName=:ln, #birthdate=:d, #userrole=:r, #usergroup=:g, email=:e, password=:p",
    ExpressionAttributeValues:{
        ":fn": parsedEvent.firstName,
        ":ln": parsedEvent.lastName,
        ":d": parsedEvent.date,
        ":r": parsedEvent.role,
        ":g": parsedEvent.group,
        ":e": parsedEvent.email,
        ":p": parsedEvent.password
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

  const stringedEvent = JSON.stringify(event);
  const parsedEvent = JSON.parse(stringedEvent);
  
  const params = {
    TableName: 'user',
    Key:{
      "userId": parsedEvent.userId
    },
    ConditionExpression:"userId = :val",
    ExpressionAttributeValues: {
        ":val": parsedEvent.userId
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
      if(data == ""){
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



