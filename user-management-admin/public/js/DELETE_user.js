//DELETE
const deleteUser = document.getElementById('DELETE_USER');
deleteUser.addEventListener('submit', function(e){
  e.preventDefault();

  fetch(linkDeleteUserAPI_POST, {
    method: "post",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token')
    },

    body: JSON.stringify({
      "userId": document.getElementById('DELETE_userId').value.trim()
    })
  });

  //document.getElementById('messageSuccessDELETE').style.color = 'green';
  //document.getElementById('messageSuccessDELETE').innerHTML = "User deleted";
  document.getElementById('DELETE_userId').value = "";
});
