//CREATE

const recovery = document.getElementById('RECOVERY');
recovery.addEventListener('submit', function(e){
  e.preventDefault();
  
  fetch(linkRecovery_POST, {
    method: "post",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token')
    },

    body: JSON.stringify({
      "timestamp": document.getElementById('RECOVERY_timestamp').value.trim()
    })
  }).then(function(){
      document.getElementById('RECOVERY_timestamp').value = "";
  }).catch(function(error){
      document.getElementById('messageSuccessRECOVERY').style.color = 'red';
      document.getElementById('messageSuccessRECOVERY').innerHTML = 'Recovery error';
  });
});
