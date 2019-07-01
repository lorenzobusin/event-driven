//CREATE

const createUser = document.getElementById('CREATE_USER');
createUser.addEventListener('submit', function(e){
  e.preventDefault();

  fetch(linkAPI_POST, {
    mode: 'no-cors',
    method: "post",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({
      "typeEvent": "C",
      "userId": generateUUID(),
      "firstName": document.getElementById('CREATE_firstName').value.trim(),
      "lastName": document.getElementById('CREATE_lastName').value.trim(),
      "date": document.getElementById('CREATE_date').value.trim(),
      "email": document.getElementById('CREATE_email').value.trim(),
      "password": document.getElementById('CREATE_password').value.trim(),
     // "role": document.getElementById('CREATE_role').value.trim(),
     // "group": document.getElementById('CREATE_group').value.trim()
    })
  });
  
  document.getElementById('CREATE_firstName').value = "";
  document.getElementById('CREATE_lastName').value = "";
  document.getElementById('CREATE_date').value = "";
  document.getElementById('CREATE_email').value = "";
  document.getElementById('CREATE_password').value = "";
  document.getElementById('confirmPassword').value = "";
  //document.getElementById('CREATE_role').value = "";
  //document.getElementById('CREATE_group').value = "";
});
