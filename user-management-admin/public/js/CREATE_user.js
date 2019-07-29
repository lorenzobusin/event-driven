//CREATE

const createUser = document.getElementById('CREATE_USER');
createUser.addEventListener('submit', function(e){
  e.preventDefault();

  if(!document.getElementById('CREATE_role').value)
    var roleValue = "undefined";
  else
    var roleValue = document.getElementById('CREATE_role').value;

  if(!document.getElementById('CREATE_group').value)
    var groupValue = "undefined";
  else
    var groupValue = document.getElementById('CREATE_group').value;

  fetch(linkCreateUserAPI_POST, {
    method: "post",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token')
    },

    body: JSON.stringify({
      "userId": document.getElementById('CREATE_userId').value.trim(),
      "firstName": document.getElementById('CREATE_firstName').value.trim(),
      "lastName": document.getElementById('CREATE_lastName').value.trim(),
      "date": document.getElementById('CREATE_date').value.trim(),
      "role": roleValue,
      "group": groupValue,
      "email": document.getElementById('CREATE_email').value.trim()
    })
  }).catch(function(error){
      document.getElementById('messageSuccessCREATE').style.color = 'red';
      document.getElementById('messageSuccessCREATE').innerHTML = 'User not created';
  });

  document.getElementById('CREATE_userId').value = "";
  document.getElementById('CREATE_firstName').value = "";
  document.getElementById('CREATE_lastName').value = "";
  document.getElementById('CREATE_date').value = "";
  document.getElementById('CREATE_email').value = "";
});
