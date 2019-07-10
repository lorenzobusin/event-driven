
module.exports.mediatorRecovery = (event, context, callback) => {
  const AWS = require('aws-sdk');
  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  const utils = require('./utils.js');

  const queryParams = {
    TableName: 'eventStore',
    ExpressionAttributeNames:{
      "#eventtimestamp": "timestamp", //timestamp is a reserved keyword
      "#eventaggregate": "aggregate" //aggregate is a reserved keyword 
    },
    ProjectionExpression: "#eventtimestamp, #eventaggregate, payload, lambda",
    ScanIndexForward: true
  };

  dynamoDb.scan(queryParams, (err, data) => {
    if (err)
      console.log(err);
    else{
      if(data == "")
        console.log("Events not found");
      else{
        const stringedData = JSON.stringify(data);
        const parsedData = JSON.parse(stringedData);
        var events  = parsedData.Items;
        events.sort((a, b) => { //order events by timestamp from the oldest
          var a1 = a.timestamp, b1 = b.timestamp;
          if (a1 < b1) return -1;
          if (a1 > b1) return 1;
          return 0;
        });

        utils.invokeLambdas(events); 
        }
      } 
  });
};


module.exports.clearDB = (event, context, callback) => {
  const AWS = require('aws-sdk');
  const LAMBDA = new AWS.Lambda();
  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  const utils = require('./utils.js');

 /* var params = {
    FunctionName: "serverless-user-management-dev-deleteAllRoles", 
    InvocationType: "Event", 
    LogType: "Tail", 
    Payload: ""
  };

  LAMBDA.invoke(params, function(err, data) {
  });*/

  //PUT RECOVERY EVENT INTO eventStore
  const item = {
    eventId: utils.generateUUID(),
    aggregate: "recovery",
    lambda: "serverless-user-management-dev-clearDB",
    timestamp: Date.now(),
    payload: "null"
  }

  const eventSourcingParams = {
    TableName: 'eventStore',
    Item: item
  };

  dynamoDb.put(eventSourcingParams, (error, data) => {
  });

};



module.exports.mediator = (event, context, callback) => {
  const AWS = require('aws-sdk');
  const LAMBDA = new AWS.Lambda();
  console.log("event: " + JSON.stringify(event));

  const typeAggregate = event.Records[0].dynamodb.NewImage.aggregate.S; //read type of aggregate from event
  const payload = JSON.stringify(event.Records[0].dynamodb.NewImage.payload.M);
  var mediatorLambda;
  console.log("type: " + typeAggregate);

  switch(typeAggregate){
    case("user"): {
      mediatorLambda = "serverless-user-management-dev-mediatorUser";
    }
    break;

    case("role"): {
      mediatorLambda = "serverless-user-management-dev-mediatorRole";
    }
    break;

    case("group"): {
      mediatorLambda = "serverless-user-management-dev-mediatorGroup";
    }
    break;

    case("auth"): {
      mediatorLambda = "serverless-user-management-dev-mediatorAuth";
    }
    break;

    default:
        console.log("Undefined type event");
  }

  const params = {
    FunctionName: mediatorLambda, 
    InvocationType: "Event", 
    LogType: "Tail", 
    Payload: payload //only string type
   };

  LAMBDA.invoke(params, function(err, data) {
    if (err)
      console.log(err);
  });
};


