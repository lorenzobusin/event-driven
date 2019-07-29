module.exports.pushCreateUserToSQS = async (event, context, callback) => {
  const AWS = require('aws-sdk');
  const SQS = new AWS.SQS();
  
  const stringedEvent = JSON.stringify(event);
  const parsedEvent = JSON.parse(stringedEvent);

  const params = {
      MessageBody: JSON.stringify(parsedEvent),
      QueueUrl: "https://sqs.eu-central-1.amazonaws.com/582373673306/createUserQueue"
  };

  try{
    const res = await SQS.sendMessage(params).promise();
    return callback(null, {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(res)
    });
  }
  catch(error){
    console.log(error);
    return callback(null, {
      statusCode: 500
    });
  } 
};

module.exports.pushUpdateUserToSQS = async (event, context, callback) => {
  const AWS = require('aws-sdk');
  const SQS = new AWS.SQS();
  
  const stringedEvent = JSON.stringify(event);
  const parsedEvent = JSON.parse(stringedEvent);

  const params = {
    MessageBody: JSON.stringify(parsedEvent),
    QueueUrl: "https://sqs.eu-central-1.amazonaws.com/582373673306/updateUserQueue"
  };

  try{
    const res = await SQS.sendMessage(params).promise();
    return callback(null, {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(res)
    });
  }
  catch(error){
    console.log(error);
    return callback(null, {
      statusCode: 500
    });
  } 
};

module.exports.pushDeleteUserToSQS = async (event, context, callback) => {
  const AWS = require('aws-sdk');
  const SQS = new AWS.SQS();
  const stringedEvent = JSON.stringify(event);

  const params = {
    MessageBody: stringedEvent,
    QueueUrl: "https://sqs.eu-central-1.amazonaws.com/582373673306/deleteUserQueue"
  };

  try{
    const res = await SQS.sendMessage(params).promise();
    return callback(null, {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(res)
    });
  }
  catch(error){
    console.log(error);
    return callback(null, {
      statusCode: 500
    });
  } 
};

module.exports.commandCreateUser = async (event, context, callback) => {
  const utils = require('./utils.js');

  const stringedEvent = event.Records[0].body.toString('utf-8'); //read new event from SQS
  const eventParsed = JSON.parse(stringedEvent);
  const stringedBody = JSON.stringify(eventParsed.body);
  const eventToCheck = JSON.parse(stringedBody);
  //const eventToCheck = JSON.parse(bodyParsed);

  const checkIdParams = {
    TableName: 'user',
    ProjectionExpression: "userId",
    FilterExpression: "userId = :checkId",
    ExpressionAttributeValues: {
        ":checkId": eventToCheck.userId
    }
  };

  const userIdAlreadyExists = await utils.asyncCheckScanDB(checkIdParams);

  const checkEmailParams = {
    TableName: 'user',
    ProjectionExpression: "email",
    FilterExpression: "email = :checkEmail",
    ExpressionAttributeValues: {
        ":checkEmail": eventToCheck.email
    }
  };

  const emailAlreadyExists = await utils.asyncCheckScanDB(checkEmailParams);
  
  if((eventToCheck.firstName == "" || eventToCheck.lastName == "" || eventToCheck.date == "" || eventToCheck.role == "" || eventToCheck.group == "") || (userIdAlreadyExists) || (emailAlreadyExists)){
    callback(null, "Email/userId already exists or empty attributes");
  }
  else{
    utils.storeEvent("user", "executeCreateUserQueue", eventToCheck);
    callback(null, "User event stored");
  }
};

module.exports.commandUpdateUser = async (event, context, callback) => {
  const utils = require('./utils.js');

  const stringedEvent = event.Records[0].body.toString('utf-8'); //read new event from SQS
  const eventParsed = JSON.parse(stringedEvent);
  const stringedBody = JSON.stringify(eventParsed.body);
  const eventToCheck = JSON.parse(stringedBody);
  //const eventToCheck = JSON.parse(bodyParsed);

  const checkEmailParams = {
    TableName: 'user',
    ProjectionExpression: "email, userId",
    FilterExpression: "email=:checkEmail and userId<>:checkUserId",
    ExpressionAttributeValues: {
        ":checkEmail": eventToCheck.email,
        ":checkUserId": eventToCheck.userId
    }
  };
  
  const emailAlreadyExists = await utils.asyncCheckScanDB(checkEmailParams);
  
  if((eventToCheck.userId == "" || eventToCheck.firstName == "" || eventToCheck.lastName == "" || eventToCheck.date == "" || eventToCheck.role == "" || eventToCheck.group == "") || (emailAlreadyExists)){
    callback(null, "Email/userId already exists or empty attributes");
  }
  else{
    utils.storeEvent("user", "executeUpdateUserQueue", eventToCheck);
    callback(null, "User event stored");
  }
};

module.exports.commandDeleteUser = async (event, context, callback) => {
  const utils = require('./utils.js');

  const stringedEvent = event.Records[0].body.toString('utf-8'); //read new event from SQS
  const eventParsed = JSON.parse(stringedEvent);
  const stringedBody = JSON.stringify(eventParsed.body);
  const eventToCheck = JSON.parse(stringedBody);
  //const eventToCheck = JSON.parse(bodyParsed);
  
  if(eventToCheck.userId == "" )
    callback(null, "Empty attribute");
  else{
    utils.storeEvent("user", "executeDeleteUserQueue", eventToCheck);
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


//USER APP
module.exports.pushSigninUserToSQS = async (event, context, callback) => {
  const AWS = require('aws-sdk');
  const SQS = new AWS.SQS();
  
  const stringedEvent = JSON.stringify(event);
  const parsedEvent = JSON.parse(stringedEvent);

  const params = {
      MessageBody: JSON.stringify(parsedEvent),
      QueueUrl: "https://sqs.eu-central-1.amazonaws.com/582373673306/createUserQueue"
  };

  try{
    const res = await SQS.sendMessage(params).promise();
    return callback(null, {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(res)
    });
  }
  catch(error){
    console.log(error);
    return callback(null, {
      statusCode: 500
    });
  } 
};

module.exports.pushUpdateProfileToSQS = async (event, context, callback) => {
  const AWS = require('aws-sdk');
  const SQS = new AWS.SQS();
  
  const stringedEvent = JSON.stringify(event);
  const parsedEvent = JSON.parse(stringedEvent);

  const params = {
    MessageBody: JSON.stringify(parsedEvent),
    QueueUrl: "https://sqs.eu-central-1.amazonaws.com/582373673306/updateUserQueue"
  };

  try{
    const res = await SQS.sendMessage(params).promise();
    return callback(null, {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(res)
    });
  }
  catch(error){
    console.log(error);
    return callback(null, {
      statusCode: 500
    });
  } 
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










