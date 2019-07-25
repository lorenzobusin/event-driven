module.exports.authorize = (event, context, callback) => {
    const jwt = require('jsonwebtoken');
    const utils = require('./utils.js');
    const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID; //get variables from environment
		const AUTH0_CLIENT_PUBLIC_KEY = process.env.AUTH0_CLIENT_PUBLIC_KEY; 
		const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
		console.log("1: " + AUTH0_CLIENT_ID);
		console.log("2: " + AUTH0_CLIENT_PUBLIC_KEY);
		console.log("3: " + AUTH0_DOMAIN);

    if (!event.authorizationToken) {
      return callback('Unauthorized');
    }
  
    const tokenParts = event.authorizationToken.split(' ');
    const tokenValue = tokenParts[1];
  
    if (!(tokenParts[0].toLowerCase() === 'bearer' && tokenValue)) { // no auth token
      return callback('Unauthorized');
		}
		
    const options = {
			algorithms: ['RS256'],
			audience: AUTH0_CLIENT_ID,
			ignoreExpiration: false,
			issuer: AUTH0_DOMAIN
		};
		
    try {
      jwt.verify(tokenValue, AUTH0_CLIENT_PUBLIC_KEY, options, (verifyError, decoded) => { 
        if (verifyError) { // 401 Unauthorized
          console.log(`Token invalid. ${verifyError}`);
          return callback('Unauthorized');
        }
        console.log('Valid from customAuthorizer', decoded);
        return callback(null, utils.generatePolicy(decoded.sub, 'Allow', event.methodArn));
      });
    } catch (err) {
      console.log('Catch error: invalid token', err);
      return callback('Unauthorized');
    }
  };