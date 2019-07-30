//CREATE

const createGroup = document.getElementById('CREATE_GROUP');
createGroup.addEventListener('submit', function(e){
  e.preventDefault();
  
  fetch(linkCreateGroupAPI_POST, {
    method: "post",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token')
    },

    body: JSON.stringify({
      "groupId": document.getElementById('CREATE_groupId').value.trim(),
      "name": document.getElementById('CREATE_name').value.trim(),
      "desc": document.getElementById('CREATE_desc').value.trim()
    })
  }).then(function(){
      document.getElementById('CREATE_roleId').value = "";
      document.getElementById('CREATE_name').value = "";
      document.getElementById('CREATE_desc').value = "";
  }).catch(function(error){
      document.getElementById('messageSuccessCREATE').style.color = 'red';
      document.getElementById('messageSuccessCREATE').innerHTML = 'Group not created';
  });
});
