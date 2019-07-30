module.exports.generateUUID = () => { //generates a unique identifier
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

module.exports.pushToSQS = async (params) => {
  const AWS = require('aws-sdk');
  const SQS = new AWS.SQS();

  try{
    const res = await SQS.sendMessage(params).promise();
    return { //success response
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(res)
    };
  }
  catch(error){
    console.log(error);
    return { //error response
      statusCode: 500
    };
  }
};

module.exports.asyncPushToExecutionQueue = async (arrayEvent) => { //push events to the corresponding execution queue in the right order
  const AWS = require('aws-sdk');                                  //and wait for their execution
  const SQS = new AWS.SQS();

  for(var i = 0; i < arrayEvent.length; i++){

    const params = {
      MessageBody: JSON.stringify(arrayEvent[i].payload),
      QueueUrl: "https://sqs.eu-central-1.amazonaws.com/582373673306/" + arrayEvent[i].executionQueue
   };
   
    await SQS.sendMessage(params).promise();
 };
};

module.exports.storeEvent = (typeAggregate, queue, eventPayload) => { //store events into eventStore
  const AWS = require('aws-sdk');
  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  const utils = require('./utils.js');

  const item = { //build the event object
    eventId: utils.generateUUID(),
    aggregate: typeAggregate,
    executionQueue: queue,
    timestamp: Date.now(),
    payload: eventPayload
  };

  const eventSourcingParams = { //params to store the event
    TableName: 'eventStore',
    Item: item
  };

  dynamoDb.put(eventSourcingParams, (error, data) => {
    if (error)
      console.log(error);
  });
};

module.exports.asyncCheckScanDB = async (params) => { //check for an item into a dynamodb table
  const AWS = require('aws-sdk');
  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  const res = await dynamoDb.scan(params).promise();

  if(res.Count == 0) 
    return false; //if the item not exists in the table
  else  
    return true; //if the item exists in the table
};

module.exports.validateEmail = (email) => { //validate an email string with a regex
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

module.exports.validatePassword = (pass) => { //validate a password string with a regex
  var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  return re.test(String(pass));
};

module.exports.generatePolicy = (principalId, effect, resource) => { //generates an AWS policy
  const authResponse = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    const statementOne = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
};

