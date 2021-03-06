//DELETE
const deleteRole = document.getElementById('DELETE_ROLE');
deleteRole.addEventListener('submit', function(e){
  e.preventDefault();

  fetch(linkDeleteRoleAPI_POST, {
    method: "post",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({
      "roleId": document.getElementById('DELETE_roleId').value.trim()
    })
  });

  document.getElementById('messageSuccessDELETE').style.color = 'green';
  document.getElementById('messageSuccessDELETE').innerHTML = "Role deleted";
  document.getElementById('DELETE_roleId').value = "";
});
