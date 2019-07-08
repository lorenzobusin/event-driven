module.exports.recovery = (event, context, callback) => {
  const AWS = require('aws-sdk');
  const LAMBDA = new AWS.Lambda();
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  //CLEAR DB TABLES
  var params = {
    FunctionName: "serverless-user-management-dev-clearDB", 
    InvocationType: "Event", 
    LogType: "Tail", 
    Payload: ""
  };

  LAMBDA.invoke(params, function(err, data) {
    if (err) 
      console.log(err);
    else 
      console.log('Clearing the DB...');
  });

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
        console.log("data: " + stringedData);

        var events = parsedData.Items; 
        events.sort((a, b) => { //order events by timestamp from the oldest
          var a1 = a.timestamp, b1 = b.timestamp;
          if (a1 < b1) return -1;
          if (a1 > b1) return 1;
          return 0;
        });

        console.log(JSON.stringify(events));

        events.forEach(item =>{
          const params = {
            FunctionName: item.lambda, 
            InvocationType: "Event", 
            LogType: "Tail", 
            Payload: JSON.stringify(item.payload)
          };
          LAMBDA.invoke(params, function(err, data) {
            if (err) 
              console.log(err);
          });
        });
      };
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