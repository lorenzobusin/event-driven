module.exports.pushEventUserToSQS = (event, context, callback) => {
  const AWS = require('aws-sdk');
  const SQS = new AWS.SQS();
  const stringedEvent = JSON.stringify(event);
  //const parsedEvent = JSON.parse(stringedEvent);
  console.log("event: " + stringedEvent);

  const params = {
    MessageBody: stringedEvent,
    QueueUrl: "https://sqs.eu-central-1.amazonaws.com/582373673306/userQueue"
  };

  SQS.sendMessage(params, function(err,data){
    if(err) {
      console.log(err);
    }else{
      console.log('userEvent successfully put in userQueue');
    }
  });
};


module.exports.mediatorUser = (event, context, callback) => {
  const AWS = require('aws-sdk');
  const LAMBDA = new AWS.Lambda();
  var utils = require('./utils.js');

  const stringedEvent = event.Records[0].body.toString('utf-8'); //read new event from SQS
  const eventParsed = JSON.parse(stringedEvent);
  const stringedBody = JSON.stringify(eventParsed);
  const bodyParsed = JSON.parse(stringedBody);

  switch(bodyParsed.body.typeEvent){
    case("C"): {
      //console.log("Event type: CREATE");
      const userParams = {
        "userId": bodyParsed.body.userId,
        "firstName": bodyParsed.body.firstName,
        "lastName": bodyParsed.body.lastName,
        "date": bodyParsed.body.date,
        "email": bodyParsed.body.email,
        "password": utils.encrypt(bodyParsed.body.password)
      };

      var params = {
        FunctionName: "serverless-user-management-dev-createUser", 
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
      const userParams = {
        "userId": bodyParsed.body.userId,
        "firstName": bodyParsed.body.firstName,
        "lastName": bodyParsed.body.lastName,
        "date": bodyParsed.body.date,
        "email": bodyParsed.body.email,
        "password": utils.encrypt(bodyParsed.body.password)
      };

      var params = {
        FunctionName: "serverless-user-management-dev-updateUser", 
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
    break;

    case("D"): {
      //console.log("Event type: DELETE");
      const userParams = {
        "userId": bodyParsed.body.userId
      };

      var params = {
        FunctionName: "serverless-user-management-dev-deleteUser", 
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
    break;
    
    default:
      console.log("Undefined type event");
  }

};

module.exports.createUser = (event, context, callback) => {
  const AWS = require('aws-sdk');
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: 'user',
    Item: event
  };

  dynamoDb.put(params, (error, data) => {
    if (error)
      console.log(error);
    else
    console.log('User successfully created');
  });
};

module.exports.readUser = (event, context, callback) => {
  const AWS = require('aws-sdk');
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const stringedEvent = JSON.stringify(event);
  const parsedEvent = JSON.parse(stringedEvent);

  const params = {
    TableName: 'user',
    Key: {
      "userId": parsedEvent.userId
    },
    ExpressionAttributeNames:{
      "#birthdate": "date" //date is a reserved keyword
    },
    ProjectionExpression: "firstName, lastName, #birthdate, email",
    KeyConditionExpression: "userId = :id",
    ExpressionAttributeValues: {
        ":id": parsedEvent.userId
    }
  };

  dynamoDb.get(params, (err, data) => {
    const stringedData = JSON.stringify(data);
    if (err)
      console.log(err);
    else{
      if(data == "")
        console.log("User not found");
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
        console.log("User successfully read");
        callback(null, response);
      }      
    }
  });
};

module.exports.updateUser = (event, context, callback) => {
  const AWS = require('aws-sdk');
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const stringedEvent = JSON.stringify(event);
  const parsedEvent = JSON.parse(stringedEvent);

  const params = {
    TableName: 'user',
    Key: {
      "userId":  parsedEvent.userId
    },
    ExpressionAttributeNames:{
      "#birthdate": "date" //date is a reserved keyword
    },
    UpdateExpression: "set firstName = :fn, lastName=:ln, #birthdate=:d, email=:e, password=:p",
    ExpressionAttributeValues:{
        ":fn": parsedEvent.firstName,
        ":ln": parsedEvent.lastName,
        ":d": parsedEvent.date,
        ":e": parsedEvent.email,
        ":p": parsedEvent.password
    }   
  };

  dynamoDb.update(params, (err, data) => {
    if (err)
      console.log(err);
    else
      console.log('User successfully updated');
  });
};

module.exports.deleteUser = (event, context, callback) => {
  const AWS = require('aws-sdk');
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const stringedEvent = JSON.stringify(event);
  const parsedEvent = JSON.parse(stringedEvent);
  
  const params = {
    TableName: 'user',
    Key:{
      "userId": parsedEvent.userId
    },
    ConditionExpression:"userId = :val",
    ExpressionAttributeValues: {
        ":val": parsedEvent.userId
    }
  };

  dynamoDb.delete(params, (err, data) => {
    if (err)
      console.log(err);
    else
    console.log('User successfully deleted');
    });
};



