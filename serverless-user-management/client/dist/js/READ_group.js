  //READ
  
function addRow(n, d) { //attributes
  const table = document.getElementById("tableResult");
  const row = table.insertRow(-1);

  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);

  cell1.innerHTML = n;
  cell2.innerHTML = d;
};

  //Mi serve avere un evento per ogni operazione di lettura e gestirlo tramite una coda?
  const readGroup = document.getElementById('READ_GROUP');
  readGroup.addEventListener('submit', function(e){
    e.preventDefault();

    fetch(linkGroupAPI_GET + document.getElementById('READ_groupId').value.trim(), {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(response){
        const responseJSON = response.json();
        return responseJSON;
    }).then(function(data){

        const stringedResponse = JSON.stringify(data);
        const parsedResponse = JSON.parse(stringedResponse);
        const parsedBody = JSON.parse(parsedResponse.body);

        document.getElementById('messageSuccessREAD').style.color = 'green';
        document.getElementById('messageSuccessREAD').innerHTML = 'Group read';

        document.getElementById('READ_groupId').value = "";
        document.getElementById("tableResult").style.visibility = "visible";

        addRow(parsedBody.Item.name, parsedBody.Item.desc);
    });

  });