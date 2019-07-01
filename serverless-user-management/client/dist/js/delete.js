//DELETE

//define API link
const linkAPI_POST = "https://mrh8oqh3li.execute-api.eu-central-1.amazonaws.com/prod/uploadeventtosqs/";

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
