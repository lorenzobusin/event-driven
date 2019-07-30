  //READ
  
function addRow(n, d) { //attributes
  const table = document.getElementById("tableResult");
  const row = table.insertRow(-1);

  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);

  cell1.innerHTML = n;
  cell2.innerHTML = d;
};

  const readGroup = document.getElementById('READ_GROUP');
  readGroup.addEventListener('submit', function(e){
    e.preventDefault();

    fetch(linkGroupAPI_GET + document.getElementById('READ_groupId').value.trim(), {
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

        document.getElementById('READ_groupId').value = "";
        document.getElementById("tableResult").style.visibility = "visible";

        addRow(parsedBody.Item.name, parsedBody.Item.desc);
    }).catch(function(error){
        document.getElementById('messageSuccessREAD').style.color = 'red';
        document.getElementById('messageSuccessREAD').innerHTML = 'Group not read';
    });

  });