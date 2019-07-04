//UPDATE

const updateUser = document.getElementById('UPDATE_USER');
updateUser.addEventListener('submit', function(e){
  e.preventDefault();

  if(document.getElementById('UPDATE_password').value == document.getElementById('UPDATE_confirmPassword').value){
    fetch(linkUserAPI_POST, {
      method: "post",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        "typeEvent": "U",
        "userId": document.getElementById('UPDATE_userId').value.trim(),
        "firstName": document.getElementById('UPDATE_firstName').value.trim(),
        "lastName": document.getElementById('UPDATE_lastName').value.trim(),
        "date": document.getElementById('UPDATE_date').value.trim(),
        "email": document.getElementById('UPDATE_email').value.trim(),
        "password": document.getElementById('UPDATE_password').value.trim(),
       // "role": document.getElementById('CREATE_role').value.trim(),
       // "group": document.getElementById('CREATE_group').value.trim()
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
    //document.getElementById('CREATE_role').value = "";
    //document.getElementById('CREATE_group').value = "";
  }
  else{
    document.getElementById('messageSuccessUPDATE').style.color = 'red';
    document.getElementById('messageSuccessUPDATE').innerHTML = 'User not updated';
  }
});