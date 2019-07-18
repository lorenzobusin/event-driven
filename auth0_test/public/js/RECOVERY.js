//CREATE

const recovery = document.getElementById('RECOVERY');
recovery.addEventListener('submit', function(e){
  e.preventDefault();
  
  fetch(linkRecovery_POST, {
    method: "post",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({
      "timestamp": document.getElementById('RECOVERY_timestamp').value.trim()
    })
  });

  document.getElementById('messageSuccessRECOVERY').style.color = 'green';
  document.getElementById('messageSuccessRECOVERY').innerHTML = 'Recovery completed';

  document.getElementById('RECOVERY_timestamp').value = "";
  
});
