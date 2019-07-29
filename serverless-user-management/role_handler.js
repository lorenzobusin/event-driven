module.exports.pushCreateRoleToSQS = async (event, context, callback) => {
  const AWS = require('aws-sdk');
  const SQS = new AWS.SQS();

  const params = {
    MessageBody: JSON.stringify(event),
    QueueUrl: "https://sqs.eu-central-1.amazonaws.com/582373673306/createRoleQueue"
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

module.exports.pushUpdateRoleToSQS = async (event, context, callback) => {
  const AWS = require('aws-sdk');
  const SQS = new AWS.SQS();

  const params = {
    MessageBody: JSON.stringify(event),
    QueueUrl: "https://sqs.eu-central-1.amazonaws.com/582373673306/updateRoleQueue"
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

module.exports.pushDeleteRoleToSQS = async (event, context, callback) => {
  const AWS = require('aws-sdk');
  const SQS = new AWS.SQS();
  const stringedEvent = JSON.stringify(event);

  const params = {
    MessageBody: stringedEvent,
    QueueUrl: "https://sqs.eu-central-1.amazonaws.com/582373673306/deleteRoleQueue"
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

module.exports.commandCreateRole = async (event, context, callback) => {
  const utils = require('./utils.js');

  const stringedEvent = event.Records[0].body.toString('utf-8'); //read new event from SQS
  const eventParsed = JSON.parse(stringedEvent);
  const stringedBody = JSON.stringify(eventParsed.body);
  const eventToCheck = JSON.parse(stringedBody);
   
  const checkNameParams = {
    TableName: 'role',
    ExpressionAttributeNames:{
      "#rolename": "name" //name is a reserved keyword
    },
    ProjectionExpression: "#rolename",
    FilterExpression: "#rolename = :checkname",
    ExpressionAttributeValues: {
        ":checkname": eventToCheck.name
    }
  };

  const nameAlreadyExists = await utils.asyncCheckScanDB(checkNameParams);
  
  if((eventToCheck.roleId == "" || eventToCheck.name == "" || eventToCheck.desc == "") || nameAlreadyExists)
    callback(null, "Name already exists or empty attributes");
  else{
    utils.storeEvent("role", "executeCreateRoleQueue", eventToCheck);
    callback(null, "Role event stored");
  }
    
};

module.exports.commandUpdateRole = async (event, context, callback) => {
  const utils = require('./utils.js');

  const stringedEvent = event.Records[0].body.toString('utf-8'); //read new event from SQS
  const eventParsed = JSON.parse(stringedEvent);
  const stringedBody = JSON.stringify(eventParsed.body);
  const eventToCheck = JSON.parse(stringedBody);

  const checkNameParams = {
    TableName: 'role',
    ExpressionAttributeNames:{
      "#rolename": "name" //name is a reserved keyword
    },
    ProjectionExpression: "#rolename",
    FilterExpression: "#rolename = :checkname",
    ExpressionAttributeValues: {
        ":checkname": eventToCheck.name
    }
  };

  const nameAlreadyExists = await utils.asyncCheckScanDB(checkNameParams);
  
  if((eventToCheck.roleId == "" || eventToCheck.name == "" || eventToCheck.desc == "") || nameAlreadyExists)
    callback(null, "Name already exists or empty attributes");
  else{
    utils.storeEvent("role", "executeUpdateRoleQueue", eventToCheck);
    callback(null, "Role event stored");
  }
};

module.exports.commandDeleteRole = (event, context, callback) => {
  const utils = require('./utils.js');

  const stringedEvent = event.Records[0].body.toString('utf-8'); //read new event from SQS
  const eventParsed = JSON.parse(stringedEvent);
  const stringedBody = JSON.stringify(eventParsed.body);
  const eventToCheck = JSON.parse(stringedBody);
  
  if(eventToCheck.roleId == "")
    callback(null, "Empty attribute");
  else{
    utils.storeEvent("role", "executeDeleteRoleQueue", eventToCheck);
    callback(null, "Role event stored");
  }
};

module.exports.createRole = async (event, context, callback) => {
  const AWS = require('aws-sdk');
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const stringedBody = event.Records[0].body.toString('utf-8');
  const parsedBody = JSON.parse(stringedBody);

  const params = {
    TableName: 'role',
    Item: parsedBody
  };

  await dynamoDb.put(params, (err, data) => {
    if (err){
      console.log(err);
      callback(null, err);
    }
    else
      callback(null, "Role created");
  }).promise();

};

module.exports.updateRole = async (event, context, callback) => {
  const AWS = require('aws-sdk');
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const stringedBody = event.Records[0].body.toString('utf-8');
  const parsedBody = JSON.parse(stringedBody);

  const params = {
    TableName: 'role',
    Key: {
      "roleId":  parsedBody.roleId
    },
    ExpressionAttributeNames:{
      "#rolename": "name", //name is a reserved keyword
      "#roledesc": "desc",  //desc is a reserved keyword
      "#roleauth": "auth" //auth is a reserved keyword
    },
    UpdateExpression: "set #rolename=:n, #roledesc=:d, #roleauth=:a",
    ExpressionAttributeValues:{
        ":n": parsedBody.name,
        ":d": parsedBody.desc,
        ":a": parsedBody.auth
    }   
  };

  await dynamoDb.update(params, (err, data) => {
    if (err){
      console.log(err);
      callback(null, err);
    }
    else
      callback(null, "Role updated");
  }).promise();
};

module.exports.deleteRole = async (event, context, callback) => {
  const AWS = require('aws-sdk');
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const stringedBody = event.Records[0].body.toString('utf-8');
  const parsedBody = JSON.parse(stringedBody);
  
  const params = {
    TableName: 'role',
    Key:{
      "roleId": parsedBody.roleId
    },
    ConditionExpression:"roleId = :val",
    ExpressionAttributeValues: {
        ":val": parsedBody.roleId
    }
  };
  
  await dynamoDb.delete(params, (err, data) => {
    if (err){
      console.log(err);
      callback(null, err);
    }
    else
      callback(null, "Role deleted");
  }).promise();
};

//READ MODE LAMBDAs

module.exports.readRole = (event, context, callback) => {
  const AWS = require('aws-sdk');
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const stringedEvent = JSON.stringify(event);
  const parsedEvent = JSON.parse(stringedEvent);

  const params = {
    TableName: 'role',
    Key: {
      "roleId": parsedEvent.roleId
    },
    ExpressionAttributeNames:{
      "#rolename": "name", //name is a reserved keyword
      "#roledesc": "desc", //desc is a reserved keyword
      "#roleauth": "auth"  //auth is a reserved keyword
    },
    ProjectionExpression: "#rolename, #roledesc, #roleauth",
    KeyConditionExpression: "roleId = :id",
    ExpressionAttributeValues: {
        ":id": parsedEvent.roleId
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
        console.log("Role not found");
        callback(null, "Role not found");
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
        console.log("Role successfully read");
        callback(null, response);
      }      
    }
  });
};

module.exports.getAllRoles = (event, context, callback) => {
  const AWS = require('aws-sdk');
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: 'role',
    ExpressionAttributeNames:{
      "#rolename": "name" //name is a reserved keyword
    },
    ProjectionExpression: "#rolename"
  };

  dynamoDb.scan(params, (err, data) => {
    const stringedData = JSON.stringify(data);
    if (err){
      console.log(err);
      callback(null, err);
    }
    else{
      if(data.Count == 0){
        console.log("Role not found");
        callback(null, "Role not found");
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



