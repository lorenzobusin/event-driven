  //READ
  
function addRow(fn, ln, d, e) { //attributes
  const table = document.getElementById("tableResult");
  const row = table.insertRow(-1);

  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  var cell4 = row.insertCell(3);

  cell1.innerHTML = fn;
  cell2.innerHTML = ln;
  cell3.innerHTML = d;
  cell4.innerHTML = e;
};

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
        return responseJSON;
    }).then(function(data){

        const stringedResponse = JSON.stringify(data);
        const parsedResponse = JSON.parse(stringedResponse);
        const parsedBody = JSON.parse(parsedResponse.body);

        document.getElementById('messageSuccessREAD').style.color = 'green';
        document.getElementById('messageSuccessREAD').innerHTML = 'User read';

        document.getElementById('READ_userId').value = "";
        document.getElementById("tableResult").style.visibility = "visible";

        addRow(parsedBody.Item.firstName, parsedBody.Item.lastName, parsedBody.Item.date, parsedBody.Item.email);
    });

  });