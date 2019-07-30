//DELETE
const deleteGroup = document.getElementById('DELETE_GROUP');
deleteGroup.addEventListener('submit', function(e){
  e.preventDefault();

  fetch(linkDeleteGroupAPI_POST, {
    method: "post",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token')
    },

    body: JSON.stringify({
      "groupId": document.getElementById('DELETE_groupId').value.trim()
    })
  }).then(function(){
      document.getElementById('DELETE_groupId').value = "";
  }).catch(function(error){
      document.getElementById('messageSuccessDELETE').style.color = 'red';
      document.getElementById('messageSuccessDELETE').innerHTML = "Group not deleted";
  });
});
