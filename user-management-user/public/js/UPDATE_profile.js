//UPDATE

const updateProfile = document.getElementById('UPDATE_PROFILE');
updateProfile.addEventListener('submit', function(e){
  e.preventDefault();

  if(!document.getElementById('PROFILE_role').value)
    var roleValue = "undefined";
  else
    var roleValue = document.getElementById('PROFILE_role').value;

  if(!document.getElementById('PROFILE_group').value)
    var groupValue = "undefined";
  else
    var groupValue = document.getElementById('PROFILE_group').value;

  fetch(linkUpdateUserAPI_POST, {
    method: "post",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token')      
    },

    body: JSON.stringify({
      "userId": document.getElementById('PROFILE_userId').value.trim(),
      "firstName": document.getElementById('PROFILE_firstName').value.trim(),
      "lastName": document.getElementById('PROFILE_lastName').value.trim(),
      "date": document.getElementById('PROFILE_date').value.trim(),
      "role": roleValue,
      "group": groupValue,
      "email": document.getElementById('PROFILE_email').value.trim()
    })
  }).then(function(response){
      const responseJSON = response.json();
      return responseJSON;
  }).then(function(data){
      try{
        const stringedResponse = JSON.stringify(data);
        console.log(stringedResponse);
      }
      catch(e){
        console.log(e);
        //window.location.href = '/signin';
      };
  });
});
