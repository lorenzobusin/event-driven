//define API link
const linkAPI_POST = "https://2ont8yn0k4.execute-api.eu-central-1.amazonaws.com/dev/pusheventusertosqs";
const linkAPI_GET = "https://2ont8yn0k4.execute-api.eu-central-1.amazonaws.com/dev/readUser?userId=";

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
