//define API link
const linkUserAPI_POST = "https://2ont8yn0k4.execute-api.eu-central-1.amazonaws.com/dev/pusheventusertosqs";
const linkUserAPI_GET = "https://2ont8yn0k4.execute-api.eu-central-1.amazonaws.com/dev/readUser?userId=";
const linkRoleAPI_POST = "https://2ont8yn0k4.execute-api.eu-central-1.amazonaws.com/dev/pusheventroletosqs";
const linkRoleAPI_GET = "https://2ont8yn0k4.execute-api.eu-central-1.amazonaws.com/dev/readRole?roleId=";
const linkAuthAPI_POST = "https://2ont8yn0k4.execute-api.eu-central-1.amazonaws.com/dev/pusheventauthtosqs";
const linkAuthAPI_GET = "https://2ont8yn0k4.execute-api.eu-central-1.amazonaws.com/dev/readAuth?authId=";
const linkGroupAPI_POST = "https://2ont8yn0k4.execute-api.eu-central-1.amazonaws.com/dev/pusheventgrouptosqs";
const linkGroupAPI_GET = "https://2ont8yn0k4.execute-api.eu-central-1.amazonaws.com/dev/readGroup?groupId=";
const linkGetAllRoles_GET = "https://2ont8yn0k4.execute-api.eu-central-1.amazonaws.com/dev/getAllRoles";
const linkGetAllGroups_GET = "https://2ont8yn0k4.execute-api.eu-central-1.amazonaws.com/dev/getAllGroups";
const linkGetAllAuths_GET = "https://2ont8yn0k4.execute-api.eu-central-1.amazonaws.com/dev/getAllAuths";
const linkRecovery_POST = "https://2ont8yn0k4.execute-api.eu-central-1.amazonaws.com/dev/mediatorrecovery";

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
};

function addAuth(elementId, nameAuth, btnId){
  document.getElementById(elementId).value += ("\n\t\t\"" + nameAuth + "\",");
  document.getElementById(btnId).disabled = true;
};

function resetAuth(elementId, ulId){
  const numAuthBtn = document.getElementById(ulId).getElementsByTagName("li").length;
  document.getElementById(elementId).value = "{" + "\n\t\"Authorizations\":  [";
  enableBtns(numAuthBtn);
};

function enableBtns(numAuthBtn){
  for(var i = 0; i < numAuthBtn; i++){
    var authBtnId = "btn-auth-" + i;
    document.getElementById(authBtnId).disabled = false;
  }
};