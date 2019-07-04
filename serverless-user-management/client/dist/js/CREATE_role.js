//CREATE

const createRole = document.getElementById('CREATE_ROLE');
createRole.addEventListener('submit', function(e){
  e.preventDefault();
  
  fetch(linkRoleAPI_POST, {
    method: "post",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({
      "typeEvent": "C",
      "roleId": generateUUID(),
      "name": document.getElementById('CREATE_name').value.trim(),
      "desc": document.getElementById('CREATE_desc').value.trim()
    })
  });

  document.getElementById('messageSuccessCREATE').style.color = 'green';
  document.getElementById('messageSuccessCREATE').innerHTML = 'Role created';

  document.getElementById('CREATE_name').value = "";
  document.getElementById('CREATE_desc').value = "";
  
});
