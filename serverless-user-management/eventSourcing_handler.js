
module.exports.mediator = (event, context, callback) => {
  const AWS = require('aws-sdk');
  const LAMBDA = new AWS.Lambda();
  const parser = AWS.DynamoDB.Converter;
  var typeAggregate, payload, mediatorLambda;

  try{
    const parsedEvent = parser.unmarshall(event.Records[0].dynamodb.NewImage); //convert dynamodb event to js object
    typeAggregate =parsedEvent.aggregate; //read type of aggregate from event
    payload = JSON.stringify(parsedEvent.payload);
  }catch (e) {
    payload = "";
    console.log(e);
  }

  if(payload == "")
    return "Empty payload"
  else{
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

module.exports.recovery = (event, context, callback) => {
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
    FilterExpression: "#eventtimestamp >= :timest",
    ExpressionAttributeValues: {
      ":timest": parseInt(event.body.timestamp, 10)
    }
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

        console.log(events);

        utils.invokeLambdas(events); 
        }
      } 
  });
};




