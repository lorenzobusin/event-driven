
module.exports.mediator = (event, context, callback) => { //orchestrates the events stored to update the views
  const AWS = require('aws-sdk');
  const SQS = new AWS.SQS();
  const parser = AWS.DynamoDB.Converter; //module to parse dynamodb objects

  try{
    var parsedEvent = parser.unmarshall(event.Records[0].dynamodb.NewImage); //convert dynamodb event to js object
  }catch (err) {
    console.log(err);
    callback(null, err);
  }
 
  const params = { //get the SQS params 
     MessageBody: JSON.stringify(parsedEvent.payload),
     QueueUrl: "https://sqs.eu-central-1.amazonaws.com/582373673306/" + parsedEvent.executionQueue
  };

  SQS.sendMessage(params, function(err,data){ //push to SQS
    if(err){
      console.log(err);
      callback(null, err);
    }
    else
      callback(null, "Execution event pushed to SQS");
  });
};

module.exports.recovery = (event, context, callback) => { //rebuild the system's state(views) from a specific timestamp
  const AWS = require('aws-sdk');
  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  const utils = require('./utils.js');

  const queryParams = { //params to get all the events stored from a specific timestamp
    TableName: 'eventStore',
    ExpressionAttributeNames:{
      "#eventtimestamp": "timestamp", //timestamp is a reserved keyword
      "#eventaggregate": "aggregate" //aggregate is a reserved keyword 
    },
    ProjectionExpression: "#eventtimestamp, #eventaggregate, payload, executionQueue",
    FilterExpression: "#eventtimestamp >= :timest",
    ExpressionAttributeValues: {
      ":timest": parseInt(event.body.timestamp, 10)
    }
  };

  dynamoDb.scan(queryParams, (err, data) => {
    if (err){
      console.log(err);
      callback(null, err);
    }
    else{
      if(data.Count == 0)
        callback(null, "Events not found");
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
        utils.asyncPushToExecutionQueue(events); //push the events to the corresponding queue
        callback(null, "Recovering...");
      }
    } 
  });
};





