//UPDATE

const signinUser = document.getElementById('SIGNIN_USER');
signinUser.addEventListener('submit', function(e){
  e.preventDefault();
  fetch(linkCreateUserAPI_POST, {
    method: "post",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({
      "userId": document.getElementById('SIGNIN_userId').value.trim(),
      "firstName": document.getElementById('SIGNIN_firstName').value.trim(),
      "lastName": document.getElementById('SIGNIN_lastName').value.trim(),
      "date": document.getElementById('SIGNIN_date').value.trim(),
      "email": document.getElementById('SIGNIN_email').value.trim()
    })
  });
  window.location.href = '/profile';
});
