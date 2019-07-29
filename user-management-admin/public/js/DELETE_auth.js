//DELETE
const deleteAuth = document.getElementById('DELETE_AUTH');
deleteAuth.addEventListener('submit', function(e){
  e.preventDefault();

  fetch(linkDeleteAuthAPI_POST, {
    method: "post",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token')
    },

    body: JSON.stringify({
      "authId": document.getElementById('DELETE_authId').value.trim()
    })
  }).then(function(){
      document.getElementById('DELETE_authId').value = "";
  }).catch(function(error){
      document.getElementById('messageSuccessDELETE').style.color = 'red';
      document.getElementById('messageSuccessDELETE').innerHTML = "Authorization not deleted";
  });
});
