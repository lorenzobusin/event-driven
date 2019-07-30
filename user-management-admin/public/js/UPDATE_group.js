//UPDATE

const updateGroup = document.getElementById('UPDATE_GROUP');
updateGroup.addEventListener('submit', function(e){
  e.preventDefault();

  fetch(linkUpdateGroupAPI_POST, {
    method: "post",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token')
    },

    body: JSON.stringify({
      "groupId": document.getElementById('UPDATE_groupId').value.trim(),
      "name": document.getElementById('UPDATE_name').value.trim(),
      "desc": document.getElementById('UPDATE_desc').value.trim()
    })
  }).then(function(){
    document.getElementById('UPDATE_groupId').value = "";
    document.getElementById('UPDATE_name').value = "";
    document.getElementById('UPDATE_desc').value = "";
  }).catch(function(error){
    document.getElementById('messageSuccessUPDATE').style.color = 'red';
    document.getElementById('messageSuccessUPDATE').innerHTML = 'Group not updated';
  });
});