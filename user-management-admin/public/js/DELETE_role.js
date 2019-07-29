//DELETE
const deleteRole = document.getElementById('DELETE_ROLE');
deleteRole.addEventListener('submit', function(e){
  e.preventDefault();

  fetch(linkDeleteRoleAPI_POST, {
    method: "post",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token')
    },

    body: JSON.stringify({
      "roleId": document.getElementById('DELETE_roleId').value.trim()
    })
  }).then(function(){
      document.getElementById('DELETE_roleId').value = "";
  }).catch(function(error){
      document.getElementById('messageSuccessDELETE').style.color = 'red';
      document.getElementById('messageSuccessDELETE').innerHTML = "Role not deleted";
  }); 
});
