module.exports.pushEventRoleToSQS = (event, context, callback) => {
  const AWS = require('aws-sdk');
  const SQS = new AWS.SQS();
  const stringedEvent = JSON.stringify(event);

  const params = {
    MessageBody: stringedEvent,
    QueueUrl: "https://sqs.eu-central-1.amazonaws.com/582373673306/roleQueue"
  };

  SQS.sendMessage(params, function(err,data){
    if(err) {
      console.log(err);
    }else{
      console.log('roleEvent successfully put in roleQueue');
    }
  });
};

module.exports.mediatorRole = (event, context, callback) => {
  const AWS = require('aws-sdk');
  const LAMBDA = new AWS.Lambda();

  const stringedEvent = event.Records[0].body.toString('utf-8'); //read new event from SQS
  const eventParsed = JSON.parse(stringedEvent);
  const stringedBody = JSON.stringify(eventParsed);
  const bodyParsed = JSON.parse(stringedBody);

  switch(bodyParsed.body.typeEvent){
    case("C"): {
      //console.log("Event type: CREATE");
      const roleParams = {
        "roleId": bodyParsed.body.roleId,
        "name": bodyParsed.body.name,
        "desc": bodyParsed.body.desc
      };

      var params = {
        FunctionName: "serverless-user-management-dev-createRole", 
        InvocationType: "Event", 
        LogType: "Tail", 
        Payload: JSON.stringify(roleParams) //only string type
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
      const roleParams = {
        "roleId": bodyParsed.body.roleId,
        "name": bodyParsed.body.name,
        "desc": bodyParsed.body.desc
      };

      var params = {
        FunctionName: "serverless-user-management-dev-updateRole", 
        InvocationType: "Event", 
        LogType: "Tail", 
        Payload: JSON.stringify(roleParams) //only string type
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
      const roleParams = {
        "roleId": bodyParsed.body.roleId
      };

      var params = {
        FunctionName: "serverless-user-management-dev-deleteRole", 
        InvocationType: "Event", 
        LogType: "Tail", 
        Payload: JSON.stringify(roleParams) //only string type
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
    else
    console.log('User successfully created');
  });
};

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
      "#roledesc": "desc"  //desc is a reserved keyword
    },
    ProjectionExpression: "#rolename, #roledesc",
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
      "#roledesc": "desc"  //desc is a reserved keyword
    },
    UpdateExpression: "set #rolename=:n, #roledesc=:d",
    ExpressionAttributeValues:{
        ":n": parsedEvent.name,
        ":d": parsedEvent.desc
    }   
  };

  dynamoDb.update(params, (err, data) => {
    if (err)
      console.log(err);
    else
      console.log('Role successfully updated');
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
    else
    console.log('Role successfully deleted');
    });
};



