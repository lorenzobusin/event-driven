//define API link
const linkCreateUserAPI_POST = "https://njy6q7lc8a.execute-api.eu-central-1.amazonaws.com/dev/pushcreateusertosqs";
const linkUpdateUserAPI_POST = "https://njy6q7lc8a.execute-api.eu-central-1.amazonaws.com/dev/pushupdateusertosqs";
const linkReadUserAPI_GET = "https://njy6q7lc8a.execute-api.eu-central-1.amazonaws.com/dev/readUser?userId=";


function setUserId(auth0Id){
	document.getElementById('SIGNIN_userId').value = auth0Id.trim().substr(6);
};