module.exports.pushCreateGroupToSQS = (event, context, callback) => {
  const AWS = require('aws-sdk');
  const SQS = new AWS.SQS();
  const stringedEvent = JSON.stringify(event);

  const params = {
    MessageBody: stringedEvent,
    QueueUrl: "https://sqs.eu-central-1.amazonaws.com/582373673306/createGroupQueue"
  };

  SQS.sendMessage(params, function(err,data){
    if(err){
      console.log(err);
      callback(null, err);
    }
    else
      callback(null, "Group event pushed to SQS");
  });
};

module.exports.pushUpdateGroupToSQS = (event, context, callback) => {
  const AWS = require('aws-sdk');
  const SQS = new AWS.SQS();
  const stringedEvent = JSON.stringify(event);

  const params = {
    MessageBody: stringedEvent,
    QueueUrl: "https://sqs.eu-central-1.amazonaws.com/582373673306/updateGroupQueue"
  };

  SQS.sendMessage(params, function(err,data){
    if(err){
      console.log(err);
      callback(null, err);
    }
    else
      callback(null, "Group event pushed to SQS");
  });
};

module.exports.pushDeleteGroupToSQS = (event, context, callback) => {
  const AWS = require('aws-sdk');
  const SQS = new AWS.SQS();
  const stringedEvent = JSON.stringify(event);

  const params = {
    MessageBody: stringedEvent,
    QueueUrl: "https://sqs.eu-central-1.amazonaws.com/582373673306/deleteGroupQueue"
  };

  SQS.sendMessage(params, function(err,data){
    if(err){
      console.log(err);
      callback(null, err);
    }
    else
      callback(null, "Group event pushed to SQS");
  });
};

module.exports.commandCreateGroup = async (event, context, callback) => {
  const utils = require('./utils.js');

  const stringedEvent = event.Records[0].body.toString('utf-8'); //read new event from SQS
  const eventParsed = JSON.parse(stringedEvent);
  const stringedBody = JSON.stringify(eventParsed);
  const bodyParsed = JSON.parse(stringedBody);
  const check = bodyParsed.body;

  const checkNameParams = {
    TableName: 'group',
    ExpressionAttributeNames:{
      "#groupname": "name" //name is a reserved keyword
    },
    ProjectionExpression: "#groupname",
    FilterExpression: "#groupname = :checkname",
    ExpressionAttributeValues: {
        ":checkname": check.name
    }
  };

  const nameAlreadyExists = await utils.asyncCheckScanDB(checkNameParams);
  
  if((check.groupId == "" || check.name == "" || check.desc == "") || nameAlreadyExists)
    callback(null, "Name already exists or empty attributes");
  else{
    utils.storeEvent("group", "executeCreateGroupQueue", bodyParsed.body);
    callback(null, "Group event stored");
  }
};

module.exports.commandUpdateGroup = async (event, context, callback) => {
  const utils = require('./utils.js');

  const stringedEvent = event.Records[0].body.toString('utf-8'); //read new event from SQS
  const eventParsed = JSON.parse(stringedEvent);
  const stringedBody = JSON.stringify(eventParsed);
  const bodyParsed = JSON.parse(stringedBody);
  const check = bodyParsed.body;

  const checkNameParams = {
    TableName: 'group',
    ExpressionAttributeNames:{
      "#groupname": "name" //name is a reserved keyword
    },
    ProjectionExpression: "#groupname",
    FilterExpression: "#groupname = :checkname",
    ExpressionAttributeValues: {
        ":checkname": check.name
    }
  };

  const nameAlreadyExists = await utils.asyncCheckScanDB(checkNameParams);
  
  if((check.groupId == "" || check.name == "" || check.desc == "") || nameAlreadyExists)
    callback(null, "Name already exists or empty attributes");
  else{
    utils.storeEvent("group", "executeUpdateGroupQueue", bodyParsed.body);
    callback(null, "Group event stored");
  }
};

module.exports.commandDeleteGroup = (event, context, callback) => {
  const utils = require('./utils.js');

  const stringedEvent = event.Records[0].body.toString('utf-8'); //read new event from SQS
  const eventParsed = JSON.parse(stringedEvent);
  const stringedBody = JSON.stringify(eventParsed);
  const bodyParsed = JSON.parse(stringedBody);
  const check = bodyParsed.body;
  
  if(check.groupId == "")
    callback(null, "Empty attributes");
  else{
    utils.storeEvent("group", "executeDeleteGroupQueue", bodyParsed.body);
    callback(null, "Group event stored");
  }
};

module.exports.createGroup = async (event, context, callback) => {
  const AWS = require('aws-sdk');
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const stringedBody = event.Records[0].body.toString('utf-8');
  const parsedBody = JSON.parse(stringedBody);

  const params = {
    TableName: 'group',
    Item: parsedBody
  };

  await dynamoDb.put(params, (err, data) => {
    if (err){
      console.log(err);
      callback(null, err);
    }
    else
      callback(null, "Group created");
  }).promise();
};

module.exports.updateGroup = async (event, context, callback) => {
  const AWS = require('aws-sdk');
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const stringedBody = event.Records[0].body.toString('utf-8');
  const parsedBody = JSON.parse(stringedBody);

  const params = {
    TableName: 'group',
    Key: {
      "groupId":  parsedBody.groupId
    },
    ExpressionAttributeNames:{
      "#groupname": "name", //name is a reserved keyword
      "#groupdesc": "desc"  //desc is a reserved keyword
    },
    UpdateExpression: "set #groupname=:n, #groupdesc=:d",
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
      callback(null, "Group updated");
  }).promise();
};

module.exports.deleteGroup = async (event, context, callback) => {
  const AWS = require('aws-sdk');
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const stringedBody = event.Records[0].body.toString('utf-8');
  const parsedBody = JSON.parse(stringedBody);
  
  const params = {
    TableName: 'group',
    Key:{
      "groupId": parsedBody.groupId
    },
    ConditionExpression:"groupId = :val",
    ExpressionAttributeValues: {
        ":val": parsedBody.groupId
    }
  };

  await dynamoDb.delete(params, (err, data) => {
    if (err){
      console.log(err);
      callback(null, err);
    }
    else
      callback(null, "Group deleted");
  }).promise();
};

//READ MODE LAMBDAs

module.exports.readGroup = (event, context, callback) => {
  const AWS = require('aws-sdk');
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const stringedEvent = JSON.stringify(event);
  const parsedEvent = JSON.parse(stringedEvent);

  const params = {
    TableName: 'group',
    Key: {
      "groupId": parsedEvent.groupId
    },
    ExpressionAttributeNames:{
      "#groupname": "name", //name is a reserved keyword
      "#groupdesc": "desc"  //desc is a reserved keyword
    },
    ProjectionExpression: "#groupname, #groupdesc",
    KeyConditionExpression: "groupId = :id",
    ExpressionAttributeValues: {
        ":id": parsedEvent.groupId
    }
  };

  dynamoDb.get(params, (err, data) => {
    const stringedData = JSON.stringify(data);
    if (err){
      console.log(err);
      callback(null, err);
    }
    else{
      if(data.Count == 0)
        callback(null, "Group not found");
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
        console.log("Group successfully read");
        callback(null, response);
      }      
    }
  });
};

module.exports.getAllGroups = (event, context, callback) => {
  const AWS = require('aws-sdk');
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: 'group',
    ExpressionAttributeNames:{
      "#groupname": "name" //name is a reserved keyword
    },
    ProjectionExpression: "#groupname"
  };

  dynamoDb.scan(params, (err, data) => {
    const stringedData = JSON.stringify(data);
    if (err){
      console.log(err);
      callback(null, err);
    }
    else{
      if(data.Count == 0)
        callback(null, "Groups not found");
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





