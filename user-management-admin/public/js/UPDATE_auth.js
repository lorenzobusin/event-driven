//UPDATE

const updateAuth = document.getElementById('UPDATE_AUTH');
updateAuth.addEventListener('submit', function(e){
  e.preventDefault();

  fetch(linkUpdateAuthAPI_POST, {
    method: "post",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token')
    },

    body: JSON.stringify({
      "authId": document.getElementById('UPDATE_authId').value.trim(),
      "name": document.getElementById('UPDATE_name').value.trim(),
      "desc": document.getElementById('UPDATE_desc').value.trim()
    })
  }).then(function(){
      document.getElementById('UPDATE_authId').value = "";
      document.getElementById('UPDATE_name').value = "";
      document.getElementById('UPDATE_desc').value = "";
  }).catch(function(error){
      document.getElementById('messageSuccessUPDATE').style.color = 'red';
      document.getElementById('messageSuccessUPDATE').innerHTML = 'Authorization not updated';
  });

  

 
});