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