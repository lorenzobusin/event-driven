module.exports.pushCreateRoleToSQS = (event, context, callback) => {
  const AWS = require('aws-sdk');
  const SQS = new AWS.SQS();
  const stringedEvent = JSON.stringify(event);

  const params = {
    MessageBody: stringedEvent,
    QueueUrl: "https://sqs.eu-central-1.amazonaws.com/582373673306/createRoleQueue"
  };

  SQS.sendMessage(params, function(err,data){
    if(err)
      console.log(err);
  });
};

module.exports.pushUpdateRoleToSQS = (event, context, callback) => {
  const AWS = require('aws-sdk');
  const SQS = new AWS.SQS();
  const stringedEvent = JSON.stringify(event);

  const params = {
    MessageBody: stringedEvent,
    QueueUrl: "https://sqs.eu-central-1.amazonaws.com/582373673306/updateRoleQueue"
  };

  SQS.sendMessage(params, function(err,data){
    if(err)
      console.log(err);
  });
};

module.exports.pushDeleteRoleToSQS = (event, context, callback) => {
  const AWS = require('aws-sdk');
  const SQS = new AWS.SQS();
  const stringedEvent = JSON.stringify(event);

  const params = {
    MessageBody: stringedEvent,
    QueueUrl: "https://sqs.eu-central-1.amazonaws.com/582373673306/deleteRoleQueue"
  };

  SQS.sendMessage(params, function(err,data){
    if(err)
      console.log(err);
  });
};

module.exports.commandCreateRole = (event, context, callback) => {
  const AWS = require('aws-sdk');
  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  const utils = require('./utils.js');

  const stringedEvent = event.Records[0].body.toString('utf-8'); //read new event from SQS
  const eventParsed = JSON.parse(stringedEvent);
  const stringedBody = JSON.stringify(eventParsed);
  const bodyParsed = JSON.parse(stringedBody);
  const lambdaName = "serverless-user-management-dev-createRole";

  //check event
  const roleParams = {
    "groupId": bodyParsed.body.groupId,
    "name": bodyParsed.body.name,
    "desc": bodyParsed.body.desc
  };

  const item = {
    eventId: utils.generateUUID(),
    aggregate: "role",
    lambda: lambdaName,
    timestamp: Date.now(),
    payload: bodyParsed.body
  };

  const eventSourcingParams = {
    TableName: 'eventStore',
    Item: item
  };

  dynamoDb.put(eventSourcingParams, (error, data) => {
    if (error)
      console.log(error);
  });
};

module.exports.commandUpdateRole = (event, context, callback) => {
  const AWS = require('aws-sdk');
  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  const utils = require('./utils.js');

  const stringedEvent = event.Records[0].body.toString('utf-8'); //read new event from SQS
  const eventParsed = JSON.parse(stringedEvent);
  const stringedBody = JSON.stringify(eventParsed);
  const bodyParsed = JSON.parse(stringedBody);
  const lambdaName = "serverless-user-management-dev-updateRole";

  //check event
  const roleParams = {
    "groupId": bodyParsed.body.groupId,
    "name": bodyParsed.body.name,
    "desc": bodyParsed.body.desc
  };

  const item = {
    eventId: utils.generateUUID(),
    aggregate: "role",
    lambda: lambdaName,
    timestamp: Date.now(),
    payload: bodyParsed.body
  };

  const eventSourcingParams = {
    TableName: 'eventStore',
    Item: item
  };

  dynamoDb.put(eventSourcingParams, (error, data) => {
    if (error)
      console.log(error);
  });
};

module.exports.commandDeleteRole = (event, context, callback) => {
  const AWS = require('aws-sdk');
  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  const utils = require('./utils.js');

  const stringedEvent = event.Records[0].body.toString('utf-8'); //read new event from SQS
  const eventParsed = JSON.parse(stringedEvent);
  const stringedBody = JSON.stringify(eventParsed);
  const bodyParsed = JSON.parse(stringedBody);
  const lambdaName = "serverless-user-management-dev-deleteRole";

  //check event
  const roleParams = {
    "groupId": bodyParsed.body.groupId
  };

  const item = {
    eventId: utils.generateUUID(),
    aggregate: "role",
    lambda: lambdaName,
    timestamp: Date.now(),
    payload: bodyParsed.body
  };

  const eventSourcingParams = {
    TableName: 'eventStore',
    Item: item
  };

  dynamoDb.put(eventSourcingParams, (error, data) => {
    if (error)
      console.log(error);
  });
};

module.exports.mediatorRole = (event, context, callback) => {
  const AWS = require('aws-sdk');
  const LAMBDA = new AWS.Lambda();

  const stringedEvent = JSON.stringify(event);
  const parsedEvent = JSON.parse(stringedEvent);

  switch(parsedEvent.typeEvent){
    case("C"): {
      const roleParams = {
        "roleId": parsedEvent.roleId,
        "name": parsedEvent.name,
        "desc": parsedEvent.desc,
        "auth": parsedEvent.auth
      };

      var params = {
        FunctionName: "serverless-user-management-dev-createRole", 
        InvocationType: "Event", 
        LogType: "Tail", 
        Payload: JSON.stringify(roleParams) //only string type
       };

       LAMBDA.invoke(params, function(err, data) {
        if (err)
          console.log(err);
      });
    }
    break;

    case("U"): {
      const roleParams = {
        "roleId": parsedEvent.roleId,
        "name": parsedEvent.name,
        "desc": parsedEvent.desc,
        "auth": parsedEvent.auth
      };

      var params = {
        FunctionName: "serverless-user-management-dev-updateRole", 
        InvocationType: "Event", 
        LogType: "Tail", 
        Payload: JSON.stringify(roleParams) //only string type
       };

       LAMBDA.invoke(params, function(err, data) {
        if (err)
          console.log(err);
      });
    }
    break;

    case("D"): {
      const roleParams = {
        "roleId": parsedEvent.roleId
      };

      var params = {
        FunctionName: "serverless-user-management-dev-deleteRole", 
        InvocationType: "Event", 
        LogType: "Tail", 
        Payload: JSON.stringify(roleParams) //only string type
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

module.exports.createRole = (event, context, callback) => {
  const AWS = require('aws-sdk');
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: 'role',
    Item: event
  };

  dynamoDb.put(params, (error, data) => {
    if (error)
      console.log(error);
  });

};

module.exports.updateRole = (event, context, callback) => {
  const AWS = require('aws-sdk');
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const stringedEvent = JSON.stringify(event);
  const parsedEvent = JSON.parse(stringedEvent);

  const params = {
    TableName: 'role',
    Key: {
      "roleId":  parsedEvent.roleId
    },
    ExpressionAttributeNames:{
      "#rolename": "name", //name is a reserved keyword
      "#roledesc": "desc",  //desc is a reserved keyword
      "#roleauth": "auth" //auth is a reserved keyword
    },
    UpdateExpression: "set #rolename=:n, #roledesc=:d, #roleauth=:a",
    ExpressionAttributeValues:{
        ":n": parsedEvent.name,
        ":d": parsedEvent.desc,
        ":a": parsedEvent.auth
    }   
  };

  dynamoDb.update(params, (err, data) => {
    if (err)
      console.log(err);
  });
};

module.exports.deleteRole = (event, context, callback) => {
  const AWS = require('aws-sdk');
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const stringedEvent = JSON.stringify(event);
  const parsedEvent = JSON.parse(stringedEvent);
  
  const params = {
    TableName: 'role',
    Key:{
      "roleId": parsedEvent.roleId
    },
    ConditionExpression:"roleId = :val",
    ExpressionAttributeValues: {
        ":val": parsedEvent.roleId
    }
  };
  
  dynamoDb.delete(params, (err, data) => {
    if (err)
      console.log(err);
  });
};

module.exports.deleteAllRoles = (event, context, callback) => {
  const AWS = require('aws-sdk');
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

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
    if (err)
      console.log(err);
    else{
      if(data == "")
        console.log("Role not found");
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
    if (err)
      console.log(err);
    else{
      if(data == "")
        console.log("Roles not found");
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



