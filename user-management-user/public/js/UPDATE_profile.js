//UPDATE

const updateProfile = document.getElementById('UPDATE_PROFILE');
updateProfile.addEventListener('submit', function(e){
  e.preventDefault();
  fetch(linkUpdateUserAPI_POST, {
    method: "post",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({
      "userId": document.getElementById('PROFILE_userId').value.trim(),
      "firstName": document.getElementById('PROFILE_firstName').value.trim(),
      "lastName": document.getElementById('PROFILE_lastName').value.trim(),
      "date": document.getElementById('PROFILE_date').value.trim(),
      "role": document.getElementById('PROFILE_role').value,
      "group": document.getElementById('PROFILE_group').value,
      "email": document.getElementById('PROFILE_email').value.trim()
    })
  });
  document.getElementById('loader_update').style.visibility = "visible";
  setTimeout(function(){ window.location.href = '/profile'; }, 5000); //wait before redirect
});
