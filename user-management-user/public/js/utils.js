//define API link
const linkCreateUserAPI_POST = "https://2ont8yn0k4.execute-api.eu-central-1.amazonaws.com/dev/pushcreateusertosqs";
const linkUpdateUserAPI_POST = "https://2ont8yn0k4.execute-api.eu-central-1.amazonaws.com/dev/pushupdateusertosqs";


function setUserId(auth0Id){
	document.getElementById('SIGNIN_userId').value = auth0Id.trim().substr(6);
};