  module.exports.pushCreateAuthToSQS = (event, context, callback) => {
    const AWS = require('aws-sdk');
    const SQS = new AWS.SQS();
    const stringedEvent = JSON.stringify(event);
  
    const params = {
      MessageBody: stringedEvent,
      QueueUrl: "https://sqs.eu-central-1.amazonaws.com/582373673306/createAuthQueue"
    };
  
    SQS.sendMessage(params, function(err,data){
      if(err){
        console.log(err);
        callback(null, err);
      }
      else
        callback(null, "Auth event pushed to SQS");
    });
  };

  module.exports.pushUpdateAuthToSQS = (event, context, callback) => {
    const AWS = require('aws-sdk');
    const SQS = new AWS.SQS();
    const stringedEvent = JSON.stringify(event);
  
    const params = {
      MessageBody: stringedEvent,
      QueueUrl: "https://sqs.eu-central-1.amazonaws.com/582373673306/updateAuthQueue"
    };
  
    SQS.sendMessage(params, function(err,data){
      if(err){
        console.log(err);
        callback(null, err);
      }
      else
        callback(null, "Auth event pushed to SQS");
    });
  };

  module.exports.pushDeleteAuthToSQS = (event, context, callback) => {
    const AWS = require('aws-sdk');
    const SQS = new AWS.SQS();
    const stringedEvent = JSON.stringify(event);
  
    const params = {
      MessageBody: stringedEvent,
      QueueUrl: "https://sqs.eu-central-1.amazonaws.com/582373673306/deleteAuthQueue"
    };
  
    SQS.sendMessage(params, function(err,data){
      if(err){
        console.log(err);
        callback(null, err);
      }
      else
        callback(null, "Auth event pushed to SQS");
    });
  };

  module.exports.commandCreateAuth = async (event, context, callback) => {
    const utils = require('./utils.js');

    const stringedEvent = event.Records[0].body.toString('utf-8'); //read new event from SQS
    const eventParsed = JSON.parse(stringedEvent);
    const stringedBody = JSON.stringify(eventParsed);
    const bodyParsed = JSON.parse(stringedBody);
    const check = bodyParsed.body;
  
    const checkNameParams = {
      TableName: 'auth',
      ExpressionAttributeNames:{
        "#authname": "name" //name is a reserved keyword
      },
      ProjectionExpression: "#authname",
      FilterExpression: "#authname = :checkname",
      ExpressionAttributeValues: {
          ":checkname": check.name
      }
    };
  
    const nameAlreadyExists = await utils.asyncCheckScanDB(checkNameParams);
    
    if((check.authId == "" || check.name == "" || check.desc == "") || nameAlreadyExists)
      callback(null, "Name already exists or empty attributes");
    else{
      utils.storeEvent("auth", "executeCreateAuthQueue", bodyParsed.body);
      callback(null, "Auth event stored");
    }
  };

  module.exports.commandUpdateAuth = async (event, context, callback) => {
    const utils = require('./utils.js');

    const stringedEvent = event.Records[0].body.toString('utf-8'); //read new event from SQS
    const eventParsed = JSON.parse(stringedEvent);
    const stringedBody = JSON.stringify(eventParsed);
    const bodyParsed = JSON.parse(stringedBody);
    const check = bodyParsed.body;
  
    const checkNameParams = {
      TableName: 'auth',
      ExpressionAttributeNames:{
        "#authname": "name" //name is a reserved keyword
      },
      ProjectionExpression: "#authname",
      FilterExpression: "#authname = :checkname",
      ExpressionAttributeValues: {
          ":checkname": check.name
      }
    };
  
    const nameAlreadyExists = await utils.asyncCheckScanDB(checkNameParams);
    
    if((check.authId == "" || check.name == "" || check.desc == "") || nameAlreadyExists)
      callback(null, "Name already exists or empty attributes");
    else{
      utils.storeEvent("auth", "executeUpdateAuthQueue", bodyParsed.body);
      callback(null, "Auth event stored");
    }
  };

  module.exports.commandDeleteAuth = (event, context, callback) => {
    const utils = require('./utils.js');

    const stringedEvent = event.Records[0].body.toString('utf-8'); //read new event from SQS
    const eventParsed = JSON.parse(stringedEvent);
    const stringedBody = JSON.stringify(eventParsed);
    const bodyParsed = JSON.parse(stringedBody);
    const check = bodyParsed.body;
    
    if(check.authId == "")
      callback(null, "Empty attribute");
    else{
      utils.storeEvent("auth", "executeDeleteAuthQueue", bodyParsed.body);
      callback(null, "Auth event stored");
    }
  };
  
  module.exports.createAuth = async (event, context, callback) => {
    const AWS = require('aws-sdk');
    const dynamoDb = new AWS.DynamoDB.DocumentClient();

    const stringedBody = event.Records[0].body.toString('utf-8');
    const parsedBody = JSON.parse(stringedBody);
  
    const params = {
      TableName: 'auth',
      Item: parsedBody
    };
  
    await dynamoDb.put(params, (err, data) => {
      if (err){
        console.log(err);
        callback(null, err);
      }
      else
        callback(null, "Authorization successfully created");
    }).promise();
  };
  
  module.exports.updateAuth = async (event, context, callback) => {
    const AWS = require('aws-sdk');
    const dynamoDb = new AWS.DynamoDB.DocumentClient();
  
    const stringedBody = event.Records[0].body.toString('utf-8');
    const parsedBody = JSON.parse(stringedBody);
  
    const params = {
      TableName: 'auth',
      Key: {
        "authId":  parsedBody.authId
      },
      ExpressionAttributeNames:{
        "#authname": "name", //name is a reserved keyword
        "#authdesc": "desc"  //desc is a reserved keyword
      },
      UpdateExpression: "set #authname=:n, #authdesc=:d",
      ExpressionAttributeValues:{
          ":n": parsedBody.name,
          ":d": parsedBody.desc
      }   
    };
  
    await dynamoDb.update(params, (err, data) => {
      if (err){
        console.log(err);
        callback(null, err);
      }
      else
        callback(null, "Autorization successfully updated");
    }).promise();
  };
  
  module.exports.deleteAuth = async (event, context, callback) => {
    const AWS = require('aws-sdk');
    const dynamoDb = new AWS.DynamoDB.DocumentClient();
  
    const stringedBody = event.Records[0].body.toString('utf-8');
    const parsedBody = JSON.parse(stringedBody);
    
    const params = {
      TableName: 'auth',
      Key:{
        "authId": parsedBody.authId
      },
      ConditionExpression:"authId = :val",
      ExpressionAttributeValues: {
          ":val": parsedBody.authId
      }
    };
  
    await dynamoDb.delete(params, (err, data) => {
      if (err){
        console.log(err);
        callback(null, err)
      }
      else
        callback(null, "Authorization successfully deleted");
    }).promise();
  };

  //READ MODE LAMBDAs

  module.exports.readAuth = (event, context, callback) => {
    const AWS = require('aws-sdk');
    const dynamoDb = new AWS.DynamoDB.DocumentClient();
  
    const stringedEvent = JSON.stringify(event);
    const parsedEvent = JSON.parse(stringedEvent);
  
    const params = {
      TableName: 'auth',
      Key: {
        "authId": parsedEvent.authId
      },
      ExpressionAttributeNames:{
        "#authname": "name", //name is a reserved keyword
        "#authdesc": "desc"  //desc is a reserved keyword
      },
      ProjectionExpression: "#authname, #authdesc",
      KeyConditionExpression: "authId = :id",
      ExpressionAttributeValues: {
          ":id": parsedEvent.authId
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
          callback(null, "Authorization not found");
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
          console.log("Authorization successfully read");
          callback(null, response);
        }      
      }
    });
  };

  module.exports.getAllAuths = (event, context, callback) => {
    const AWS = require('aws-sdk');
    const dynamoDb = new AWS.DynamoDB.DocumentClient();
  
    const params = {
      TableName: 'auth',
      ExpressionAttributeNames:{
        "#authname": "name" //name is a reserved keyword
      },
      ProjectionExpression: "#authname"
    };
  
    dynamoDb.scan(params, (err, data) => {
      const stringedData = JSON.stringify(data);
      if (err){
        console.log(err);
        callback(null, err);
      }
      else{
        if(data.Count == 0)
          callback(null, "Authorizations not found");
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
  
  
  
  