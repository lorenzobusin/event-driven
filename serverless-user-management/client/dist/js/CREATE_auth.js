//CREATE

const createAuth = document.getElementById('CREATE_AUTH');
createAuth.addEventListener('submit', function(e){
  e.preventDefault();
  
  fetch(linkCreateAuthAPI_POST, {
    method: "post",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({
      "typeEvent": "C",
      "authId": generateUUID(),
      "name": document.getElementById('CREATE_name').value.trim(),
      "desc": document.getElementById('CREATE_desc').value.trim()
    })
  });

  document.getElementById('messageSuccessCREATE').style.color = 'green';
  document.getElementById('messageSuccessCREATE').innerHTML = 'Authorization created';

  document.getElementById('CREATE_name').value = "";
  document.getElementById('CREATE_desc').value = "";
  
});
