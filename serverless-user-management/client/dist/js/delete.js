//DELETE
const deleteUser = document.getElementById('DELETE_USER');
deleteUser.addEventListener('submit', function(e){
  e.preventDefault();

  fetch(linkAPI_POST, {
    mode: 'no-cors',
    method: "post",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({
      "typeEvent": "D",
      "userId": document.getElementById('DELETE_userId').value.trim()
    })
  });

  document.getElementById('DELETE_userId').value = "";
});
