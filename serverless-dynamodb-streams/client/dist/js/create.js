
//define API link
const linkAPI_POST = "https://mrh8oqh3li.execute-api.eu-central-1.amazonaws.com/prod/uploadeventtosqs/";

//CREATE
const createUser = document.getElementById('CREATE_USER');
createUser.addEventListener('submit', function(e){
  e.preventDefault();

  fetch(linkAPI_POST, {
    mode: 'no-cors',
    method: "post",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({
      "typeEvent": "C",
      "userId": generateRowId(4),
      "firstName": document.getElementById('CREATE_firstName').value.trim(),
      "lastName": document.getElementById('CREATE_lastName').value.trim(),
      "username": document.getElementById('CREATE_username').value.trim()
    })
  });

  document.getElementById('CREATE_userId').value = "";
  document.getElementById('CREATE_firstName').value = "";
  document.getElementById('CREATE_lastName').value = "";
  document.getElementById('CREATE_username').value = "";
});


function generateRowId(shardId) {
  var CUSTOMEPOCH = 1300000000000;  // artificial epoch
  var ts = new Date().getTime() - CUSTOMEPOCH; // limit to recent
  var randid = Math.floor(Math.random() * 512);
  ts = (ts * 64);   // bit-shift << 6
  ts = ts + shardId;
  return ((ts * 512) + (randid % 512)).toString();
};
