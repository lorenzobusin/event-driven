module.exports.pushEventGroupToSQS = (event, context, callback) => {
    const AWS = require('aws-sdk');
    const SQS = new AWS.SQS();
    const stringedEvent = JSON.stringify(event);
  
    const params = {
      MessageBody: stringedEvent,
      QueueUrl: "https://sqs.eu-central-1.amazonaws.com/582373673306/groupQueue"
    };
  
    SQS.sendMessage(params, function(err,data){
      if(err) {
        console.log(err);
      }else{
        console.log('groupEvent successfully put in groupQueue');
      }
    });
  };
  
  module.exports.mediatorGroup = (event, context, callback) => {
    const AWS = require('aws-sdk');
    const LAMBDA = new AWS.Lambda();
  
    const stringedEvent = event.Records[0].body.toString('utf-8'); //read new event from SQS
    const eventParsed = JSON.parse(stringedEvent);
    const stringedBody = JSON.stringify(eventParsed);
    const bodyParsed = JSON.parse(stringedBody);
  
    switch(bodyParsed.body.typeEvent){
      case("C"): {
        //console.log("Event type: CREATE");
        const groupParams = {
          "groupId": bodyParsed.body.groupId,
          "name": bodyParsed.body.name,
          "desc": bodyParsed.body.desc
        };
  
        var params = {
          FunctionName: "serverless-user-management-dev-createGroup", 
          InvocationType: "Event", 
          LogType: "Tail", 
          Payload: JSON.stringify(groupParams) //only string type
         };
  
         LAMBDA.invoke(params, function(err, data) {
          if (err) {
            console.log(err);
          } else {
            console.log('Payload sending...');
          }
        });
      }
      break;
  
     /* case("R"): {
        console.log("Event type: READ");
        var params = {
          FunctionName: "serverless-user-management-dev-getUser", 
          InvocationType: "Event", 
          LogType: "Tail", 
          Payload: JSON.stringify(userParams) //only string type
         };
  
         LAMBDA.invoke(params, function(err, data) {
          if (err) {
            console.log(err);
          } else {
            console.log('Payload sending...');
          }
        });
      }
      break;*/
  
      case("U"): {
        //console.log("Event type: UPDATE");
        const groupParams = {
          "groupId": bodyParsed.body.groupId,
          "name": bodyParsed.body.name,
          "desc": bodyParsed.body.desc
        };
  
        var params = {
          FunctionName: "serverless-user-management-dev-updateGroup", 
          InvocationType: "Event", 
          LogType: "Tail", 
          Payload: JSON.stringify(groupParams) //only string type
         };
  
         LAMBDA.invoke(params, function(err, data) {
          if (err) {
            console.log(err);
          } else {
            console.log('Payload sending...');
          }
        });
      }
      break;
  
      case("D"): {
        //console.log("Event type: DELETE");
        const groupParams = {
          "groupId": bodyParsed.body.groupId
        };
  
        var params = {
          FunctionName: "serverless-user-management-dev-deleteGroup", 
          InvocationType: "Event", 
          LogType: "Tail", 
          Payload: JSON.stringify(groupParams) //only string type
        };
  
         LAMBDA.invoke(params, function(err, data) {
          if (err) {
            console.log(err);
          } else {
            console.log('Payload sending...');
          }
        });
      }
      break;
      
      default:
        console.log("Undefined type event");
    }
  
  };
  
  module.exports.createGroup = (event, context, callback) => {
    const AWS = require('aws-sdk');
    const dynamoDb = new AWS.DynamoDB.DocumentClient();
    const utils = require('./utils.js'); 
  
    const params = {
      TableName: 'group',
      Item: event
    };
  
    dynamoDb.put(params, (error, data) => {
      if (error)
        console.log(error);
      else{
        console.log('Group successfully created');
  
        const item = {
          eventId: utils.generateUUID(),
          aggregate: "group",
          lambda: "serverless-user-management-dev-createGroup",
          timestamp: Date.now(),
          payload: event
        }
  

  
        const eventSourcingParams = {
          TableName: 'eventStore',
          Item: item
        };
  
        dynamoDb.put(eventSourcingParams, (error, data) => {
          if (error)
            console.log(error);
          else
            console.log('Event successfully stored');
        });
      }
    });
  };
  
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
      if (err)
        console.log(err);
      else{
        if(data == "")
          console.log("Group not found");
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
      if (err)
        console.log(err);
      else{
        if(data == "")
          console.log("Groups not found");
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
  
  module.exports.updateGroup = (event, context, callback) => {
    const AWS = require('aws-sdk');
    const dynamoDb = new AWS.DynamoDB.DocumentClient();
    const utils = require('./utils.js');
  
    const stringedEvent = JSON.stringify(event);
    const parsedEvent = JSON.parse(stringedEvent);
  
    const params = {
      TableName: 'group',
      Key: {
        "groupId":  parsedEvent.groupId
      },
      ExpressionAttributeNames:{
        "#groupname": "name", //name is a reserved keyword
        "#groupdesc": "desc"  //desc is a reserved keyword
      },
      UpdateExpression: "set #groupname=:n, #groupdesc=:d",
      ExpressionAttributeValues:{
          ":n": parsedEvent.name,
          ":d": parsedEvent.desc
      }   
    };
  
    dynamoDb.update(params, (err, data) => {
      if (err)
        console.log(err);
      else{
        console.log('Group successfully updated');
  
        const item = {
          eventId: utils.generateUUID(),
          aggregate: "group",
          lambda: "serverless-user-management-dev-updateGroup",
          timestamp: Date.now(),
          payload: event
        }
  
        const eventSourcingParams = {
          TableName: 'eventStore',
          Item: item
        };
  
        dynamoDb.put(eventSourcingParams, (error, data) => {
          if (error)
            console.log(error);
          else
            console.log('Event successfully stored');
        });
      }
    });
  };
  
  module.exports.deleteGroup = (event, context, callback) => {
    const AWS = require('aws-sdk');
    const dynamoDb = new AWS.DynamoDB.DocumentClient();
    const utils = require('./utils.js');
  
    const stringedEvent = JSON.stringify(event);
    const parsedEvent = JSON.parse(stringedEvent);
    
    const params = {
      TableName: 'group',
      Key:{
        "groupId": parsedEvent.groupId
      },
      ConditionExpression:"groupId = :val",
      ExpressionAttributeValues: {
          ":val": parsedEvent.groupId
      }
    };
  
    dynamoDb.delete(params, (err, data) => {
      if (err)
        console.log(err);
      else{
        console.log('Group successfully deleted');
  
        const item = {
          eventId: utils.generateUUID(),
          aggregate: "group",
          lambda: "serverless-user-management-dev-deleteGroup",
          timestamp: Date.now(),
          payload: event
        }
  
        const eventSourcingParams = {
          TableName: 'eventStore',
          Item: item
        };
  
        dynamoDb.put(eventSourcingParams, (error, data) => {
          if (error)
            console.log(error);
          else
            console.log('Event successfully stored');
        });
      }
    });
  };
  
  
  
  