module.exports.pushEventStoreToSQS = (event, context, callback) => {
  const AWS = require('aws-sdk');
  const SQS = new AWS.SQS();
  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  const LAMBDA = new AWS.Lambda();

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

        async function invokeLambdas() {
          var i = 0;
          while(i < events.length){
            var params = {
              FunctionName: events[i].lambda, 
              InvocationType: "Event", 
              LogType: "Tail", 
              Payload: JSON.stringify(events[i].payload)
            };
            
            await LAMBDA.invoke(params).promise();
            i++;
          };
        };
      
        invokeLambdas();
      /*loop = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log(i);
      LAMBDA.invoke(params);
      loop();*/
        
        }
      }

     
});
};




module.exports.mediatorRecovery = (event, context, callback) => {
  const AWS = require('aws-sdk');
  const LAMBDA = new AWS.Lambda();

  const stringedBody = event.Records[0].body.toString('utf-8'); //read new event from SQS
  const parsedBody = JSON.parse(stringedBody);
  console.log("body: " + stringedBody);

  var params = {
    FunctionName: parsedBody.FunctionName, 
    InvocationType: "Event", 
    LogType: "Tail", 
    Payload: JSON.stringify(parsedBody.Payload) //only string type
   };

   LAMBDA.invoke(params, function(err, data) {
    if (err) 
      console.log(err);
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