
module.exports.login = (event, context, callback) => {
  const AWS = require('aws-sdk');
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const stringedEvent = JSON.stringify(event);
  const parsedEvent = JSON.parse(stringedEvent);
  const params = {
    TableName: 'user',
    FilterExpression: "email = :checkemail",
    ExpressionAttributeValues: {
    ":checkemail": parsedEvent.body.email
    }
  };

  dynamoDb.scan(params, (err, data) => {
    const utils = require('./utils.js');
    const stringedData = JSON.stringify(data);
    console.log("data: " + stringedData);
    if (err){
      console.log(err);
      callback(null, err);
    }
    else{
      if(data.Count == 0)
        callback(null, "Credentials error");
      else{
        if(utils.decrypt(data.Items[0].password.toString()) == parsedEvent.body.password){
          const response = {
            statusCode: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true
            },
            body: "Login success! Welcome " + parsedEvent.body.firstName + parsedEvent.body.lastName
           };
          callback(null, response);
        }
        else
          callback(null, "Credentials error");
      }      
    }
});
};