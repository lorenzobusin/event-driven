//DELETE
const deleteAuth = document.getElementById('DELETE_AUTH');
deleteAuth.addEventListener('submit', function(e){
  e.preventDefault();

  fetch(linkDeleteAuthAPI_POST, {
    method: "post",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({
      "authId": document.getElementById('DELETE_authId').value.trim()
    })
  });

  document.getElementById('messageSuccessDELETE').style.color = 'green';
  document.getElementById('messageSuccessDELETE').innerHTML = "Authorization deleted";
  document.getElementById('DELETE_authId').value = "";
});
