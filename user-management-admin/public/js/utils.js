//define API link
const linkCreateUserAPI_POST = "https://njy6q7lc8a.execute-api.eu-central-1.amazonaws.com/dev/pushcreateusertosqs";
const linkUpdateUserAPI_POST = "https://njy6q7lc8a.execute-api.eu-central-1.amazonaws.com/dev/pushupdateusertosqs";
const linkDeleteUserAPI_POST = "https://njy6q7lc8a.execute-api.eu-central-1.amazonaws.com/dev/pushdeleteusertosqs";
const linkUserAPI_GET = "https://njy6q7lc8a.execute-api.eu-central-1.amazonaws.com/dev/readUser?userId=";
const linkCreateRoleAPI_POST = "https://njy6q7lc8a.execute-api.eu-central-1.amazonaws.com/dev/pushcreateroletosqs";
const linkUpdateRoleAPI_POST = "https://njy6q7lc8a.execute-api.eu-central-1.amazonaws.com/dev/pushupdateroletosqs";
const linkDeleteRoleAPI_POST = "https://njy6q7lc8a.execute-api.eu-central-1.amazonaws.com/dev/pushdeleteroletosqs";
const linkRoleAPI_GET = "https://njy6q7lc8a.execute-api.eu-central-1.amazonaws.com/dev/readRole?roleId=";
const linkCreateAuthAPI_POST = "https://njy6q7lc8a.execute-api.eu-central-1.amazonaws.com/dev/pushcreateauthtosqs";
const linkUpdateAuthAPI_POST = "https://njy6q7lc8a.execute-api.eu-central-1.amazonaws.com/dev/pushupdateauthtosqs";
const linkDeleteAuthAPI_POST = "https://njy6q7lc8a.execute-api.eu-central-1.amazonaws.com/dev/pushdeleteauthtosqs";
const linkAuthAPI_GET = "https://njy6q7lc8a.execute-api.eu-central-1.amazonaws.com/dev/readAuth?authId=";
const linkCreateGroupAPI_POST = "https://njy6q7lc8a.execute-api.eu-central-1.amazonaws.com/dev/pushcreategrouptosqs";
const linkUpdateGroupAPI_POST = "https://njy6q7lc8a.execute-api.eu-central-1.amazonaws.com/dev/pushupdategrouptosqs";
const linkDeleteGroupAPI_POST = "https://njy6q7lc8a.execute-api.eu-central-1.amazonaws.com/dev/pushdeletegrouptosqs";
const linkGroupAPI_GET = "https://njy6q7lc8a.execute-api.eu-central-1.amazonaws.com/dev/readGroup?groupId=";
const linkGetAllRoles_GET = "https://njy6q7lc8a.execute-api.eu-central-1.amazonaws.com/dev/getAllRoles";
const linkGetAllGroups_GET = "https://njy6q7lc8a.execute-api.eu-central-1.amazonaws.com/dev/getAllGroups";
const linkGetAllAuths_GET = "https://njy6q7lc8a.execute-api.eu-central-1.amazonaws.com/dev/getAllAuths";
const linkRecovery_POST = "https://njy6q7lc8a.execute-api.eu-central-1.amazonaws.com/dev/recovery";

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

function createSession(id_token){
  localStorage.setItem('id_token', id_token);
};

function destroySession(){
   localStorage.removeItem('id_token');
}