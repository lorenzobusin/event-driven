module.exports.encrypt = (value) => {
  const {createCipheriv, randomBytes} = require('crypto');
  const algorithm = 'aes-256-ctr';
  const key = process.env.KEY || 'b2df428b9929d3ace7c598bbf4e496b2';
  const inputEncoding = 'utf8';
  const outputEncoding = 'hex';
  const iv = Buffer.from(randomBytes(16));
  const cipher = createCipheriv(algorithm, key, iv);
  let crypted = cipher.update(value, inputEncoding, outputEncoding);
  crypted += cipher.final(outputEncoding);
  return `${iv.toString('hex')}:${crypted.toString()}`;
};

module.exports.decrypt = (value) => {
  const {createDecipheriv} = require('crypto');
  const algorithm = 'aes-256-ctr';
  const key = process.env.KEY || 'b2df428b9929d3ace7c598bbf4e496b2';
  const inputEncoding = 'utf8';
  const outputEncoding = 'hex';
  const textParts = value.split(':');
  //extract the IV from the first half of the value
  const IV = Buffer.from(textParts.shift(), outputEncoding);
  //extract the encrypted text without the IV
  const encryptedText = Buffer.from(textParts.join(':'), outputEncoding);
  //decipher the string
  const decipher = createDecipheriv(algorithm,key, IV);
  let decrypted = decipher.update(encryptedText,  outputEncoding, inputEncoding);
  decrypted += decipher.final(inputEncoding);
  return decrypted.toString();
}

module.exports.generateUUID = () => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

module.exports.asyncPushToExecutionQueue = async (arrayEvent) => {
  const AWS = require('aws-sdk');
  const SQS = new AWS.SQS();

  for(var i = 0; i < arrayEvent.length; i++){

    const params = {
      MessageBody: JSON.stringify(arrayEvent[i].payload),
      QueueUrl: "https://sqs.eu-central-1.amazonaws.com/582373673306/" + arrayEvent[i].executionQueue
   };
   
    await SQS.sendMessage(params).promise();
 };
};

module.exports.storeEvent = (typeAggregate, queue, eventPayload) => {
  const AWS = require('aws-sdk');
  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  const utils = require('./utils.js');

  const item = {
    eventId: utils.generateUUID(),
    aggregate: typeAggregate,
    executionQueue: queue,
    timestamp: Date.now(),
    payload: eventPayload
  };

  const eventSourcingParams = {
    TableName: 'eventStore',
    Item: item
  };

  dynamoDb.put(eventSourcingParams, (error, data) => {
    if (error)
      console.log(error);
  });
};

module.exports.asyncCheckScanDB = async (params) => {
  const AWS = require('aws-sdk');
  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  const res = await dynamoDb.scan(params).promise();

  if(res.Count == 0)
    return false;
  else  
    return true;
};

module.exports.validateEmail = (email) => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

module.exports.validatePassword = (pass) => {
  var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  return re.test(String(pass));
};