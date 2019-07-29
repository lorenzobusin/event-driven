//define API link
const linkSigninUserAPI_POST = "https://vd1uu19ije.execute-api.eu-central-1.amazonaws.com/dev/pushsigninusertosqs";
const linkUpdateProfileAPI_POST = "https://vd1uu19ije.execute-api.eu-central-1.amazonaws.com/dev/pushupdateprofiletosqs";
const linkGetProfileInfoAPI_GET = "https://vd1uu19ije.execute-api.eu-central-1.amazonaws.com/dev/getprofileinfo?userId=";


function setUserId(auth0Id){
	document.getElementById('SIGNIN_userId').value = auth0Id.trim().substr(6);
};

function createSession(id_token){
	localStorage.setItem('id_token', id_token);
};

function destroySession(){
	 localStorage.removeItem('id_token');
}