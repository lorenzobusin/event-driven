module.exports.pushCreateGroupToSQS = async (event, context, callback) => {
  const utils = require('./utils.js');

  const params = {
    MessageBody: JSON.stringify(event),
    QueueUrl: "https://sqs.eu-central-1.amazonaws.com/582373673306/createGroupQueue"
  };

  const res = await utils.pushToSQS(params);
  callback(null, res);
};

module.exports.pushUpdateGroupToSQS = async (event, context, callback) => {
  const utils = require('./utils.js');

  const params = {
    MessageBody: JSON.stringify(event),
    QueueUrl: "https://sqs.eu-central-1.amazonaws.com/582373673306/updateGroupQueue"
  };

  const res = await utils.pushToSQS(params);
  callback(null, res);
};

module.exports.pushDeleteGroupToSQS = async (event, context, callback) => {
  const utils = require('./utils.js');

  const params = {
    MessageBody: JSON.stringify(event),
    QueueUrl: "https://sqs.eu-central-1.amazonaws.com/582373673306/deleteGroupQueue"
  };

  const res = await utils.pushToSQS(params);
  callback(null, res);
};

module.exports.commandCreateGroup = async (event, context, callback) => {
  const utils = require('./utils.js');

  const stringedEvent = event.Records[0].body.toString('utf-8'); //read new event from SQS
  const eventParsed = JSON.parse(stringedEvent);
  const stringedBody = JSON.stringify(eventParsed.body);
  const eventToCheck = JSON.parse(stringedBody);

  const checkIdParams = { //params to check for duplicated groupId
    TableName: 'group',
    ProjectionExpression: "groupId",
    FilterExpression: "groupId = :checkId",
    ExpressionAttributeValues: {
        ":checkId": eventToCheck.groupId
    }
  };

  const groupIdAlreadyExists = await utils.asyncCheckScanDB(checkIdParams); //check for duplicated groupId
  if(groupIdAlreadyExists)
    callback(null, "groupId already exists");

  const checkNameParams = { //params to check for duplicated name
    TableName: 'group',
    ExpressionAttributeNames:{
      "#groupname": "name" //name is a reserved keyword
    },
    ProjectionExpression: "#groupname",
    FilterExpression: "#groupname = :checkname",
    ExpressionAttributeValues: {
        ":checkname": eventToCheck.name
    }
  };

  const nameAlreadyExists = await utils.asyncCheckScanDB(checkNameParams); //check for duplicated name
  if(nameAlreadyExists)
    callback(null, "Name already exists");
  
  if(eventToCheck.groupId == "" || eventToCheck.name == "" || eventToCheck.desc == "") //check for empty attributes
    callback(null, "Empty attributes");
  else{
    utils.storeEvent("group", "executeCreateGroupQueue", eventToCheck);
    callback(null, "Group event stored"); //store into eventStore
  }
};

module.exports.commandUpdateGroup = async (event, context, callback) => {
  const utils = require('./utils.js');

  const stringedEvent = event.Records[0].body.toString('utf-8'); //read new event from SQS
  const eventParsed = JSON.parse(stringedEvent);
  const stringedBody = JSON.stringify(eventParsed.body);
  const eventToCheck = JSON.parse(stringedBody);

  const checkIdParams = { //params to check if groupId exists
    TableName: 'group',
    ProjectionExpression: "groupId",
    FilterExpression: "groupId = :checkId",
    ExpressionAttributeValues: {
        ":checkId": eventToCheck.groupId
    }
  };

  const groupIdExists = await utils.asyncCheckScanDB(checkIdParams); //check if groupId exists
  if(!groupIdExists)
    callback(null, "Group not found");

  const checkNameParams = {
    TableName: 'group',
    ExpressionAttributeNames:{
      "#groupname": "name" //name is a reserved keyword
    },
    ProjectionExpression: "#groupname",
    FilterExpression: "#groupname = :checkname and groupId<>:checkGroupId", //valid if the name not changed
    ExpressionAttributeValues: {
        ":checkname": eventToCheck.name,
        ":checkGroupId": eventToCheck.groupId
    }
  };

  const nameAlreadyExists = await utils.asyncCheckScanDB(checkNameParams); //check for duplicated name
  if(nameAlreadyExists)
    callback(null, "Name already exists");
  
  if(eventToCheck.groupId == "" || eventToCheck.name == "" || eventToCheck.desc == "") //check for empty attributes
    callback(null, "Empty attributes");
  else{
    utils.storeEvent("group", "executeUpdateGroupQueue", eventToCheck); // store into eventStore
    callback(null, "Group event stored");
  }
};

module.exports.commandDeleteGroup = async (event, context, callback) => {
  const utils = require('./utils.js');

  const stringedEvent = event.Records[0].body.toString('utf-8'); //read new event from SQS
  const eventParsed = JSON.parse(stringedEvent);
  const stringedBody = JSON.stringify(eventParsed.body);
  const eventToCheck = JSON.parse(stringedBody);

  const checkIdParams = { //params to check if groupId exists
    TableName: 'group',
    ProjectionExpression: "groupId",
    FilterExpression: "groupId = :checkId",
    ExpressionAttributeValues: {
        ":checkId": eventToCheck.groupId
    }
  };

  const groupIdExists = await utils.asyncCheckScanDB(checkIdParams); //check if groupId exists
  
  if(!groupIdExists)
    callback(null, "Group not found");
  else{
    utils.storeEvent("group", "executeDeleteGroupQueue", eventToCheck); //store into eventStore
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

  const params = { //get group by id
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





