//CREATE

const createUser = document.getElementById('CREATE_USER');
createUser.addEventListener('submit', function(e){
  e.preventDefault();
  if(document.getElementById('CREATE_password').value == document.getElementById('CREATE_confirmPassword').value){
    fetch(linkCreateUserAPI_POST, {
      method: "post",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        "userId": generateUUID(),
        "firstName": document.getElementById('CREATE_firstName').value.trim(),
        "lastName": document.getElementById('CREATE_lastName').value.trim(),
        "date": document.getElementById('CREATE_date').value.trim(),
        "role": document.getElementById('CREATE_role').value,
        "group": document.getElementById('CREATE_group').value,
        "email": document.getElementById('CREATE_email').value.trim(),
        "password": document.getElementById('CREATE_password').value.trim()
      })
    });

    document.getElementById('messageSuccessCREATE').style.color = 'green';
    document.getElementById('messageSuccessCREATE').innerHTML = 'User created';

    document.getElementById('CREATE_firstName').value = "";
    document.getElementById('CREATE_lastName').value = "";
    document.getElementById('CREATE_date').value = "";
    document.getElementById('CREATE_email').value = "";
    document.getElementById('CREATE_password').value = "";
    document.getElementById('CREATE_confirmPassword').value = "";
    document.getElementById('CREATE_checkPassword').innerHTML = "";
  }
  else{
    document.getElementById('messageSuccessCREATE').style.color = 'red';
    document.getElementById('messageSuccessCREATE').innerHTML = 'User not created';
  }
  
});
