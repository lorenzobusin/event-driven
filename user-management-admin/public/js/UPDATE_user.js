//UPDATE

const updateUser = document.getElementById('UPDATE_USER');
updateUser.addEventListener('submit', function(e){
  e.preventDefault();

  if(!document.getElementById('UPDATE_role').value)
    var roleValue = "undefined";
  else
    var roleValue = document.getElementById('UPDATE_role').value;

  if(!document.getElementById('UPDATE_group').value)
    var groupValue = "undefined";
  else
    var groupValue = document.getElementById('UPDATE_group').value;

  fetch(linkUpdateUserAPI_POST, {
    method: "post",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token')
    },

    body: JSON.stringify({
      "userId": document.getElementById('UPDATE_userId').value.trim(),
      "firstName": document.getElementById('UPDATE_firstName').value.trim(),
      "lastName": document.getElementById('UPDATE_lastName').value.trim(),
      "date": document.getElementById('UPDATE_date').value.trim(),
      "role": roleValue,
      "group": groupValue,
      "email": document.getElementById('UPDATE_email').value.trim()
    })
  }).then(function(){
      document.getElementById('UPDATE_userId').value = "";
      document.getElementById('UPDATE_firstName').value = "";
      document.getElementById('UPDATE_lastName').value = "";
      document.getElementById('UPDATE_date').value = "";
      document.getElementById('UPDATE_email').value = "";
  }).catch(function(error){
      document.getElementById('messageSuccessUPDATE').style.color = 'red';
      document.getElementById('messageSuccessUPDATE').innerHTML = 'User not updated';
  });
});