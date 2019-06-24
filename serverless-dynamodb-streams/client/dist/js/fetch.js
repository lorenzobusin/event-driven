const createUser = document.getElementById('createUser');
createUser.addEventListener('submit', function(e){
  e.preventDefault();

  fetch("https://mrh8oqh3li.execute-api.eu-central-1.amazonaws.com/prod/uploadeventtosqs/", {
    mode: 'no-cors',
    method: "post",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({
      "userId": document.getElementById('userId').value,
      "firstName": document.getElementById('firstName').value,
      "lastName": document.getElementById('lastName').value,
      "username": document.getElementById('username').value
    })
  });

  document.getElementById('userId').value = "";
  document.getElementById('firstName').value = "";
  document.getElementById('lastName').value = "";
  document.getElementById('username').value = "";
});