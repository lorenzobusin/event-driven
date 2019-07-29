//CREATE

const createRole = document.getElementById('CREATE_ROLE');
createRole.addEventListener('submit', function(e){
  e.preventDefault();

  var str=document.getElementById('CREATE_auth').value;
  document.getElementById('CREATE_auth').value = str.substring(0, str.length - 1) //remove last character to validate JSON
  document.getElementById('CREATE_auth').value += (" ] }"); //close brackets JSON

  fetch(linkCreateRoleAPI_POST, {
    method: "post",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token')
    },

    body: JSON.stringify({
      "roleId": document.getElementById('CREATE_roleId').value.trim(),
      "name": document.getElementById('CREATE_name').value.trim(),
      "desc": document.getElementById('CREATE_desc').value.trim(),
      "auth": document.getElementById('CREATE_auth').value.trim()
    })
  }).then(function(){
      document.getElementById('CREATE_roleId').value = "";
      document.getElementById('CREATE_name').value = "";
      document.getElementById('CREATE_desc').value = "";
      resetAuth("CREATE_auth", "ul-Auth");
  }).catch(function(error){
      document.getElementById('messageSuccessCREATE').style.color = 'red';
      document.getElementById('messageSuccessCREATE').innerHTML = 'Role not created';
  });
});
