//SIGNIN

const signinUser = document.getElementById('SIGNIN_USER');
signinUser.addEventListener('submit', function(e){
  e.preventDefault();
  fetch(linkSigninUserAPI_POST, {
    method: "post",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token')
    },

    body: JSON.stringify({
      "userId": document.getElementById('SIGNIN_userId').value.trim(),
      "firstName": document.getElementById('SIGNIN_firstName').value.trim(),
      "lastName": document.getElementById('SIGNIN_lastName').value.trim(),
      "date": document.getElementById('SIGNIN_date').value.trim(),
      "group": "undefined",
      "role": "undefined",
      "email": document.getElementById('SIGNIN_email').value.trim()
    })
  });
  document.getElementById('loader_update').style.visibility = "visible";
  setTimeout(function(){ window.location.href = '/profile'; }, 3000); //wait before redirect
});
