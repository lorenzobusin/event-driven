  module.exports.pushCreateAuthToSQS = async (event, context, callback) => {
    const utils = require('./utils.js');
  
    const params = {
      MessageBody: JSON.stringify(event),
      QueueUrl: "https://sqs.eu-central-1.amazonaws.com/582373673306/createAuthQueue"
    };
  
    const res = await utils.pushToSQS(params);
    callback(null, res);
  };

  module.exports.pushUpdateAuthToSQS = async (event, context, callback) => {
    const utils = require('./utils.js');
  
    const params = {
      MessageBody: JSON.stringify(event),
      QueueUrl: "https://sqs.eu-central-1.amazonaws.com/582373673306/updateAuthQueue"
    };
  
    const res = await utils.pushToSQS(params);
    callback(null, res);
  };

  module.exports.pushDeleteAuthToSQS = async (event, context, callback) => {
    const utils = require('./utils.js');
  
    const params = {
      MessageBody: JSON.stringify(event),
      QueueUrl: "https://sqs.eu-central-1.amazonaws.com/582373673306/deleteAuthQueue"
    };
  
    const res = await utils.pushToSQS(params);
    callback(null, res); 
  };

  module.exports.commandCreateAuth = async (event, context, callback) => {
    const utils = require('./utils.js');

    const stringedEvent = event.Records[0].body.toString('utf-8'); //read new event from SQS
    const eventParsed = JSON.parse(stringedEvent);
    const stringedBody = JSON.stringify(eventParsed.body);
    const eventToCheck = JSON.parse(stringedBody);

    const checkIdParams = { //params to check for duplicated authId
      TableName: 'auth',
      ProjectionExpression: "authId",
      FilterExpression: "authId = :checkId",
      ExpressionAttributeValues: {
          ":checkId": eventToCheck.authId
      }
    };
  
    const authIdAlreadyExists = await utils.asyncCheckScanDB(checkIdParams); //check for duplicated authId
    if(authIdAlreadyExists)
      callback(null, "authId already exists");
  
    const checkNameParams = {
      TableName: 'auth',
      ExpressionAttributeNames:{
        "#authname": "name" //name is a reserved keyword
      },
      ProjectionExpression: "#authname",
      FilterExpression: "#authname = :checkname",
      ExpressionAttributeValues: {
          ":checkname": eventToCheck.name
      }
    };
  
    const nameAlreadyExists = await utils.asyncCheckScanDB(checkNameParams);
    if(nameAlreadyExists)
      callback(null, "Name already exists");
    
    if(eventToCheck.authId == "" || eventToCheck.name == "" || eventToCheck.desc == "") //check for empty attributes
      callback(null, "Empty attributes");
    else{
      utils.storeEvent("auth", "executeCreateAuthQueue", eventToCheck); //store into eventStore
      callback(null, "Auth event stored");
    }
  };

  module.exports.commandUpdateAuth = async (event, context, callback) => {
    const utils = require('./utils.js');

    const stringedEvent = event.Records[0].body.toString('utf-8'); //read new event from SQS
    const eventParsed = JSON.parse(stringedEvent);
    const stringedBody = JSON.stringify(eventParsed.body);
    const eventToCheck = JSON.parse(stringedBody);

    const checkIdParams = { //params to check if authId exists
      TableName: 'auth',
      ProjectionExpression: "authId",
      FilterExpression: "authId = :checkId",
      ExpressionAttributeValues: {
          ":checkId": eventToCheck.authId
      }
    };
  
    const authIdExists = await utils.asyncCheckScanDB(checkIdParams); //check if authId exists
    if(!authIdExists)
      callback(null, "Auth not found");
  
    const checkNameParams = {
      TableName: 'auth',
      ExpressionAttributeNames:{
        "#authname": "name" //name is a reserved keyword
      },
      ProjectionExpression: "#authname",
      FilterExpression: "#authname = :checkname and authId<>:checkAuthId", //valid if the name not changed
      ExpressionAttributeValues: {
          ":checkname": eventToCheck.name,
          ":checkAuthId": eventToCheck.authId
      }
    };
  
    const nameAlreadyExists = await utils.asyncCheckScanDB(checkNameParams);
    if(nameAlreadyExists)
      callback(null, "Name already exists");
    
    if(eventToCheck.authId == "" || eventToCheck.name == "" || eventToCheck.desc == "") //check for empty attributes
      callback(null, "Empty attributes");
    else{
      utils.storeEvent("auth", "executeUpdateAuthQueue", eventToCheck); //store into eventStore
      callback(null, "Auth event stored");
    }
  };

  module.exports.commandDeleteAuth = async (event, context, callback) => {
    const utils = require('./utils.js');

    const stringedEvent = event.Records[0].body.toString('utf-8'); //read new event from SQS
    const eventParsed = JSON.parse(stringedEvent);
    const stringedBody = JSON.stringify(eventParsed.body);
    const eventToCheck = JSON.parse(stringedBody);

    const checkIdParams = { //params to check if authId exists
      TableName: 'auth',
      ProjectionExpression: "authId",
      FilterExpression: "authId = :checkId",
      ExpressionAttributeValues: {
          ":checkId": eventToCheck.authId
      }
    };
  
    const authIdExists = await utils.asyncCheckScanDB(checkIdParams); //check if authId exists
    
    if(!authIdExists)
      callback(null, "Auth not found");
    else{
      utils.storeEvent("auth", "executeDeleteAuthQueue", eventToCheck); //store into eventStore
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
  
    const params = { //get auth by id
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
  
  
  
  