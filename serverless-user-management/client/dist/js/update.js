//UPDATE

//define API link
const linkAPI_POST = "https://mrh8oqh3li.execute-api.eu-central-1.amazonaws.com/prod/uploadeventtosqs/";

const updateUser = document.getElementById('UPDATE_USER');
updateUser.addEventListener('submit', function(e){
  e.preventDefault();

  fetch(linkAPI_POST, {
    mode: 'no-cors',
    method: "post",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({
      "typeEvent": "U",
      "userId": document.getElementById('UPDATE_userId').value.trim(),
      "firstName": document.getElementById('UPDATE_firstName').value.trim(),
      "lastName": document.getElementById('UPDATE_lastName').value.trim(),
      "username": document.getElementById('UPDATE_username').value.trim()
    })
  });

  document.getElementById('UPDATE_userId').value = "";
  document.getElementById('UPDATE_firstName').value = "";
  document.getElementById('UPDATE_lastName').value = "";
  document.getElementById('UPDATE_username').value = "";
});