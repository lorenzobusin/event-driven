//UPDATE

const updateUser = document.getElementById('UPDATE_USER');
updateUser.addEventListener('submit', function(e){
  e.preventDefault();
  fetch(linkUpdateUserAPI_POST, {
    method: "post",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({
      "userId": document.getElementById('UPDATE_userId').value.trim(),
      "firstName": document.getElementById('UPDATE_firstName').value.trim(),
      "lastName": document.getElementById('UPDATE_lastName').value.trim(),
      "date": document.getElementById('UPDATE_date').value.trim(),
      "role": document.getElementById('UPDATE_role').value,
      "group": document.getElementById('UPDATE_group').value,
      "email": document.getElementById('UPDATE_email').value.trim()
    })
  });

  document.getElementById('messageSuccessUPDATE').style.color = 'green';
  document.getElementById('messageSuccessUPDATE').innerHTML = 'User updated';

  document.getElementById('UPDATE_userId').value = "";
  document.getElementById('UPDATE_firstName').value = "";
  document.getElementById('UPDATE_lastName').value = "";
  document.getElementById('UPDATE_date').value = "";
  document.getElementById('UPDATE_email').value = "";
  document.getElementById('UPDATE_password').value = "";
  document.getElementById('UPDATE_confirmPassword').value = "";
  document.getElementById('UPDATE_checkPassword').innerHTML = "";

  //document.getElementById('messageSuccessUPDATE').style.color = 'red';
  //document.getElementById('messageSuccessUPDATE').innerHTML = 'User not updated';
});

function getUser(userId){
  fetch(linkUserAPI_GET + userId, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(function(response){
      const responseJSON = response.json();
      return responseJSON;
  }).then(function(data){

      const stringedResponse = JSON.stringify(data);
      const parsedResponse = JSON.parse(stringedResponse);
      const parsedBody = JSON.parse(parsedResponse.body);

      document.getElementById('PROFILE_userId').value = parsedBody.Item.firstName;
  });
};