/*module.exports.pushCreateUserToSQS = (event, context, callback) => {
  const AWS = require('aws-sdk');
  const SQS = new AWS.SQS();
  const utils = require('./utils.js');
  
  const stringedEvent = JSON.stringify(event);
  const parsedEvent = JSON.parse(stringedEvent);

  const params = {
      MessageBody: JSON.stringify(parsedEvent),
      QueueUrl: "https://sqs.eu-central-1.amazonaws.com/582373673306/createUserQueue"
  };

  SQS.sendMessage(params, function(err,data){
    if(err){
      console.log(err);
      callback(null, err);
    }
    else
      callback(null, "User event pushed to SQS");
  });  
};

module.exports.pushUpdateUserToSQS = (event, context, callback) => {
  const AWS = require('aws-sdk');
  const SQS = new AWS.SQS();
  const utils = require('./utils.js');
  
  const stringedEvent = JSON.stringify(event);
  const parsedEvent = JSON.parse(stringedEvent);

  const params = {
    MessageBody: JSON.stringify(parsedEvent),
    QueueUrl: "https://sqs.eu-central-1.amazonaws.com/582373673306/updateUserQueue"
  };

  SQS.sendMessage(params, function(err,data){
    if(err){
      console.log(err);
      callback(null, err);
    }
    else
      callback(null, "User event pushed to SQS");
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

  const checkIdParams = {
    TableName: 'user',
    ProjectionExpression: "userId",
    FilterExpression: "userId = :checkId",
    ExpressionAttributeValues: {
        ":checkId": check.userId
    }
  };

  const userIdAlreadyExists = await utils.asyncCheckScanDB(checkIdParams);

  const checkEmailParams = {
    TableName: 'user',
    ProjectionExpression: "email",
    FilterExpression: "email = :checkEmail",
    ExpressionAttributeValues: {
        ":checkEmail": check.email
    }
  };

  const emailAlreadyExists = await utils.asyncCheckScanDB(checkEmailParams);
  
  if((check.firstName == "" || check.lastName == "" || check.date == "" || check.role == "" || check.group == "") || (userIdAlreadyExists) || (emailAlreadyExists)){
    callback(null, "Email/userId already exists or empty attributes");
  }
  else{
    console.log("user stored");
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
    ProjectionExpression: "email, userId",
    FilterExpression: "email=:checkEmail and userId<>:checkUserId",
    ExpressionAttributeValues: {
        ":checkEmail": check.email,
        ":checkUserId": check.userId
    }
  };

  const emailAlreadyExists = await utils.asyncCheckScanDB(checkEmailParams);
  
  if((check.userId == "" || check.firstName == "" || check.lastName == "" || check.date == "" || check.role == "" || check.group == "") || (emailAlreadyExists)){
    callback(null, "Email/userId already exists or empty attributes");
  }
  else{
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
*/
//READ MODE LAMBDA

module.exports.readUser = (event, context, callback) => {
  const AWS = require('aws-sdk');
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const stringedEvent = JSON.stringify(event);
  const parsedEvent = JSON.parse(stringedEvent);
  console.log("event: " + stringedEvent);
  console.log("context: " + JSON.stringify(context));

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

/*module.exports.authorize = (event, context, callback) => {
    console.log("event: " + JSON.stringify(event));
    console.log("auth: " + event.authorizationToken);
    var token = event.authorizationToken;
    switch (token) {
        case 'allow':
            callback(null, generatePolicy('user', 'Allow', event.methodArn));
            break;
        case 'deny':
            callback(null, generatePolicy('user', 'Deny', event.methodArn));
            break;
        case 'unauthorized':
            callback("Unauthorized");   // Return a 401 Unauthorized response
            break;
        default:
            callback("Error: Invalid token"); // Return a 500 Invalid token response
    }
};

// Help function to generate an IAM policy
var generatePolicy = function(principalId, effect, resource) {
     var authResponse = {};
      
    authResponse.principalId = principalId;
    if (effect && resource) {
          var policyDocument = {};
          policyDocument.Version = '2012-10-17'; 
          policyDocument.Statement = [];
          var statementOne = {};
          statementOne.Action = 'execute-api:Invoke'; 
          statementOne.Effect = effect;
          statementOne.Resource = resource;
          policyDocument.Statement[0] = statementOne;
          authResponse.policyDocument = policyDocument;
    }
      
      // Optional output with custom properties of the String, Number or Boolean type.
    authResponse.context = {
          "stringKey": "stringval",
          "numberKey": 123,
          "booleanKey": true
    };
  return authResponse;
}*/

const generatePolicy = function(principalId, effect, resource) {
  const authResponse = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    const statementOne = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
};

module.exports.authorize = (event, context, callback) => {

  // Get Token
  if (typeof event.authorizationToken === 'undefined') {
    if (process.env.DEBUG === 'true') {
      console.log('AUTH: No token');
    }
    callback('A');
  }

  const split = event.authorizationToken.split('Bearer');
  if (split.length !== 2) {
    if (process.env.DEBUG === 'true') {
      console.log('AUTH: no token in Bearer');
    }
    callback('A');
  }
  const token = split[1].trim();

  switch (token.toLowerCase()) {
    case "4674cc54-bd05-11e7-abc4-cec278b6b50a":
      callback(null, generatePolicy('user123', 'Allow', event.methodArn));
      break;
    case "4674cc54-bd05-11e7-abc4-cec278b6b50b":
      callback(null, generatePolicy('user123', 'Deny', event.methodArn));
      break;
    default:
      callback('A');
   }

};



