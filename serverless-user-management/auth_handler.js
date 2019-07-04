module.exports.pushEventAuthToSQS = (event, context, callback) => {
    const AWS = require('aws-sdk');
    const SQS = new AWS.SQS();
    const stringedEvent = JSON.stringify(event);
  
    const params = {
      MessageBody: stringedEvent,
      QueueUrl: "https://sqs.eu-central-1.amazonaws.com/582373673306/authQueue"
    };
  
    SQS.sendMessage(params, function(err,data){
      if(err) {
        console.log(err);
      }else{
        console.log('authEvent successfully put in authQueue');
      }
    });
  };
  
  module.exports.mediatorAuth = (event, context, callback) => {
    const AWS = require('aws-sdk');
    const LAMBDA = new AWS.Lambda();
  
    const stringedEvent = event.Records[0].body.toString('utf-8'); //read new event from SQS
    const eventParsed = JSON.parse(stringedEvent);
    const stringedBody = JSON.stringify(eventParsed);
    const bodyParsed = JSON.parse(stringedBody);
  
    switch(bodyParsed.body.typeEvent){
      case("C"): {
        //console.log("Event type: CREATE");
        const authParams = {
          "authId": bodyParsed.body.authId,
          "name": bodyParsed.body.name,
          "desc": bodyParsed.body.desc
        };
  
        var params = {
          FunctionName: "serverless-user-management-dev-createAuth", 
          InvocationType: "Event", 
          LogType: "Tail", 
          Payload: JSON.stringify(authParams) //only string type
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
        const authParams = {
          "authId": bodyParsed.body.authId,
          "name": bodyParsed.body.name,
          "desc": bodyParsed.body.desc
        };
  
        var params = {
          FunctionName: "serverless-user-management-dev-updateAuth", 
          InvocationType: "Event", 
          LogType: "Tail", 
          Payload: JSON.stringify(authParams) //only string type
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
        const authParams = {
          "authId": bodyParsed.body.authId
        };
  var ciao ="";
        var params = {
          FunctionName: "serverless-user-management-dev-deleteAuth", 
          InvocationType: "Event", 
          LogType: "Tail", 
          Payload: JSON.stringify(authParams) //only string type
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
  
  module.exports.createAuth = (event, context, callback) => {
    const AWS = require('aws-sdk');
    const dynamoDb = new AWS.DynamoDB.DocumentClient();
  
    const params = {
      TableName: 'auth',
      Item: event
    };
  
    dynamoDb.put(params, (error, data) => {
      if (error)
        console.log(error);
      else
      console.log('Authorization successfully created');
    });
  };
  
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
      if (err)
        console.log(err);
      else{
        if(data == "")
          console.log("Authorization not found");
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
  
  module.exports.updateAuth = (event, context, callback) => {
    const AWS = require('aws-sdk');
    const dynamoDb = new AWS.DynamoDB.DocumentClient();
  
    const stringedEvent = JSON.stringify(event);
    const parsedEvent = JSON.parse(stringedEvent);
  
    const params = {
      TableName: 'auth',
      Key: {
        "authId":  parsedEvent.authId
      },
      ExpressionAttributeNames:{
        "#authname": "name", //name is a reserved keyword
        "#authdesc": "desc"  //desc is a reserved keyword
      },
      UpdateExpression: "set #authname=:n, #authdesc=:d",
      ExpressionAttributeValues:{
          ":n": parsedEvent.name,
          ":d": parsedEvent.desc
      }   
    };
  
    dynamoDb.update(params, (err, data) => {
      if (err)
        console.log(err);
      else
        console.log('Autorization successfully updated');
    });
  };
  
  module.exports.deleteAuth = (event, context, callback) => {
    const AWS = require('aws-sdk');
    const dynamoDb = new AWS.DynamoDB.DocumentClient();
  
    const stringedEvent = JSON.stringify(event);
    const parsedEvent = JSON.parse(stringedEvent);
    
    const params = {
      TableName: 'auth',
      Key:{
        "authId": parsedEvent.authId
      },
      ConditionExpression:"authId = :val",
      ExpressionAttributeValues: {
          ":val": parsedEvent.authId
      }
    };
  
    dynamoDb.delete(params, (err, data) => {
      if (err)
        console.log(err);
      else
      console.log('Authorization successfully deleted');
      });
  };
  
  
  
  