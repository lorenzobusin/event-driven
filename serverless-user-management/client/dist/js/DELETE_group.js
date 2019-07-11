//DELETE
const deleteGroup = document.getElementById('DELETE_GROUP');
deleteGroup.addEventListener('submit', function(e){
  e.preventDefault();

  fetch(linkDeleteGroupAPI_POST, {
    method: "post",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({
      "typeEvent": "D",
      "groupId": document.getElementById('DELETE_groupId').value.trim()
    })
  });

  document.getElementById('messageSuccessDELETE').style.color = 'green';
  document.getElementById('messageSuccessDELETE').innerHTML = "Group deleted";
  document.getElementById('DELETE_groupId').value = "";
});
