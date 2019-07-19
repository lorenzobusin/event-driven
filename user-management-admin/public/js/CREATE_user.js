//CREATE

const createUser = document.getElementById('CREATE_USER');
createUser.addEventListener('submit', function(e){
  e.preventDefault();
  fetch(linkCreateUserAPI_POST, {
    method: "post",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({
      "userId": document.getElementById('CREATE_userId').value.trim(),
      "firstName": document.getElementById('CREATE_firstName').value.trim(),
      "lastName": document.getElementById('CREATE_lastName').value.trim(),
      "date": document.getElementById('CREATE_date').value.trim(),
      "role": document.getElementById('CREATE_role').value,
      "group": document.getElementById('CREATE_group').value,
      "email": document.getElementById('CREATE_email').value.trim()
    })
  }).then(function(response){
        const responseJSON = response.json();
        return responseJSON;
  }).then(function(data){;

    console.log(JSON.stringify(data));
    document.getElementById('messageSuccessCREATE').style.color = 'green';
    document.getElementById('messageSuccessCREATE').innerHTML = 'User created';

    document.getElementById('CREATE_userId').value = "";
    document.getElementById('CREATE_firstName').value = "";
    document.getElementById('CREATE_lastName').value = "";
    document.getElementById('CREATE_date').value = "";
    document.getElementById('CREATE_email').value = "";
  });

  //document.getElementById('messageSuccessCREATE').style.color = 'red';
  //document.getElementById('messageSuccessCREATE').innerHTML = 'User not created';
});
