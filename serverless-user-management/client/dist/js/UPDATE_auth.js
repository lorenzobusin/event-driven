//UPDATE

const updateAuth = document.getElementById('UPDATE_AUTH');
updateAuth.addEventListener('submit', function(e){
  e.preventDefault();

  fetch(linkAuthAPI_POST, {
    method: "post",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({
      "typeEvent": "U",
      "authId": document.getElementById('UPDATE_authId').value.trim(),
      "name": document.getElementById('UPDATE_name').value.trim(),
      "desc": document.getElementById('UPDATE_desc').value.trim()
    })
  });

  document.getElementById('messageSuccessUPDATE').style.color = 'green';
  document.getElementById('messageSuccessUPDATE').innerHTML = 'Authorization updated';

  document.getElementById('UPDATE_authId').value = "";
  document.getElementById('UPDATE_name').value = "";
  document.getElementById('UPDATE_desc').value = "";
});