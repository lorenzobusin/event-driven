  //READ
  
  //Mi serve avere un evento per ogni operazione di lettura e gestirlo tramite una coda?
  const reload = document.getElementById('READ');
  reload.addEventListener('click', function(e){
    e.preventDefault();

    fetch(linkAPI_GET + document.getElementById('READ_userId').value.trim(), {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(response){
        const responseJSON = response.json();
        console.log(responseJSON);
        return responseJSON;
    }).then(function(data){

        const stringedResponse = JSON.stringify(data);
        const parsedResponse = JSON.parse(stringedResponse);
        const parsedBody = JSON.parse(parsedResponse.body);

        document.getElementById('READ_userId').value = "";
        document.getElementById('GET_fn').textContent  = parsedBody.Item.firstName;
        document.getElementById('GET_ln').textContent  = parsedBody.Item.lastName;
        document.getElementById('GET_u').textContent  = parsedBody.Item.username;
    });

  });