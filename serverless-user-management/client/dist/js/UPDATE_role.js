//UPDATE

const updateRole = document.getElementById('UPDATE_ROLE');
updateRole.addEventListener('submit', function(e){
  e.preventDefault();

  var str=document.getElementById('UPDATE_auth').value;
  document.getElementById('UPDATE_auth').value = str.substring(0, str.length - 1) //remove last character to validate JSON
  document.getElementById('UPDATE_auth').value += (" ] }"); //close brackets JSON

  fetch(linkUpdateRoleAPI_POST, {
    method: "post",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({
      "typeEvent": "U",
      "roleId": document.getElementById('UPDATE_roleId').value.trim(),
      "name": document.getElementById('UPDATE_name').value.trim(),
      "desc": document.getElementById('UPDATE_desc').value.trim(),
      "auth": document.getElementById('UPDATE_auth').value.trim()
    })
  });

  document.getElementById('messageSuccessUPDATE').style.color = 'green';
  document.getElementById('messageSuccessUPDATE').innerHTML = 'Role updated';

  document.getElementById('UPDATE_roleId').value = "";
  document.getElementById('UPDATE_name').value = "";
  document.getElementById('UPDATE_desc').value = "";
  resetAuth("UPDATE_auth", "ul-Auth");
});