  //READ
  
function addRow(n, d) { //attributes
  const table = document.getElementById("tableResult");
  const row = table.insertRow(-1);

  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);

  cell1.innerHTML = n;
  cell2.innerHTML = d;
};

  const readAuth = document.getElementById('READ_AUTH');
  readAuth.addEventListener('submit', function(e){
    e.preventDefault();

    fetch(linkAuthAPI_GET + document.getElementById('READ_authId').value.trim(), {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('id_token')
      }
    }).then(function(response){
        const responseJSON = response.json();
        return responseJSON;
    }).then(function(data){

        const stringedResponse = JSON.stringify(data);
        const parsedResponse = JSON.parse(stringedResponse);
        const parsedBody = JSON.parse(parsedResponse.body);
        document.getElementById('READ_authId').value = "";
        document.getElementById("tableResult").style.visibility = "visible";

        addRow(parsedBody.Item.name, parsedBody.Item.desc);
    }).catch(function(error){
        document.getElementById('messageSuccessREAD').style.color = 'red';
        document.getElementById('messageSuccessREAD').innerHTML = 'Authorization not read';
    });

  });