//define API link
const linkUserAPI_POST = "https://2ont8yn0k4.execute-api.eu-central-1.amazonaws.com/dev/pusheventusertosqs";
const linkUserAPI_GET = "https://2ont8yn0k4.execute-api.eu-central-1.amazonaws.com/dev/readUser?userId=";
const linkRoleAPI_POST = "https://2ont8yn0k4.execute-api.eu-central-1.amazonaws.com/dev/pusheventroletosqs";
const linkRoleAPI_GET = "https://2ont8yn0k4.execute-api.eu-central-1.amazonaws.com/dev/readRole?roleId=";
const linkAuthAPI_POST = "https://2ont8yn0k4.execute-api.eu-central-1.amazonaws.com/dev/pusheventauthtosqs";
const linkAuthAPI_GET = "https://2ont8yn0k4.execute-api.eu-central-1.amazonaws.com/dev/readAuth?authId=";

function generateUUID() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

var check = function(passId, confirmPassId, checkPassId) {
  if (document.getElementById(passId).value == document.getElementById(confirmPassId).value) {
    if(document.getElementById(passId).value == "")
      document.getElementById(checkPassId).innerHTML = "";
    else {
      document.getElementById(checkPassId).style.color = 'green';
      document.getElementById(checkPassId).innerHTML = 'Matching';
    }
  } 
  else {
    document.getElementById(checkPassId).style.color = 'red';
    document.getElementById(checkPassId).innerHTML = 'Not matching';
  }
}
