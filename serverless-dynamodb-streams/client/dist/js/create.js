
//define API link
const linkAPI_POST = "https://mrh8oqh3li.execute-api.eu-central-1.amazonaws.com/prod/uploadeventtosqs/";
const linkAPI_GET = "https://mrh8oqh3li.execute-api.eu-central-1.amazonaws.com/prod/getuser?userId=";

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
      "userId": document.getElementById('CREATE_userId').value.trim(),
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
