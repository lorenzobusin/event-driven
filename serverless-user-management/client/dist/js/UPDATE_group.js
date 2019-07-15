//UPDATE

const updateGroup = document.getElementById('UPDATE_GROUP');
updateGroup.addEventListener('submit', function(e){
  e.preventDefault();
    fetch(linkUpdateGroupAPI_POST, {
      method: "post",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        "groupId": document.getElementById('UPDATE_groupId').value.trim(),
        "name": document.getElementById('UPDATE_name').value.trim(),
        "desc": document.getElementById('UPDATE_desc').value.trim()
      })
    });

    document.getElementById('messageSuccessUPDATE').style.color = 'green';
    document.getElementById('messageSuccessUPDATE').innerHTML = 'Group updated';

    document.getElementById('UPDATE_groupId').value = "";
    document.getElementById('UPDATE_name').value = "";
    document.getElementById('UPDATE_desc').value = "";
});