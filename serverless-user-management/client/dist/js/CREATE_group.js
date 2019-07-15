//CREATE

const createGroup = document.getElementById('CREATE_GROUP');
createGroup.addEventListener('submit', function(e){
  e.preventDefault();
  
  fetch(linkCreateGroupAPI_POST, {
    method: "post",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({
      "groupId": generateUUID(),
      "name": document.getElementById('CREATE_name').value.trim(),
      "desc": document.getElementById('CREATE_desc').value.trim()
    })
  });

  document.getElementById('messageSuccessCREATE').style.color = 'green';
  document.getElementById('messageSuccessCREATE').innerHTML = 'Group created';

  document.getElementById('CREATE_name').value = "";
  document.getElementById('CREATE_desc').value = "";
  
});
