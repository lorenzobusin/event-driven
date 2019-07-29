//CREATE

const createAuth = document.getElementById('CREATE_AUTH');
createAuth.addEventListener('submit', function(e){
  e.preventDefault();
  
  fetch(linkCreateAuthAPI_POST, {
    method: "post",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token')
    },

    body: JSON.stringify({
      "authId": document.getElementById('CREATE_authId').value.trim(),
      "name": document.getElementById('CREATE_name').value.trim(),
      "desc": document.getElementById('CREATE_desc').value.trim()
    })
  }).then(function(){
      document.getElementById('CREATE_authId').value = "";
      document.getElementById('CREATE_name').value = "";
      document.getElementById('CREATE_desc').value = "";
  }).catch(function(error){
      document.getElementById('messageSuccessCREATE').style.color = 'red';
      document.getElementById('messageSuccessCREATE').innerHTML = 'Authorization not created';
  });
});
