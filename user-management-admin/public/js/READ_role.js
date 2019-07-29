  //READ
  
function addRow(n, d, a) { //attributes
  const table = document.getElementById("tableResult");
  const row = table.insertRow(-1);

  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);

  cell1.innerHTML = n;
  cell2.innerHTML = d;
  cell3.innerHTML = a;
};

  const readRole = document.getElementById('READ_ROLE');
  readRole.addEventListener('submit', function(e){
    e.preventDefault();

    fetch(linkRoleAPI_GET + document.getElementById('READ_roleId').value.trim(), {
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

        const parsedAuth = JSON.parse(parsedBody.Item.auth);

        document.getElementById('READ_roleId').value = "";
        document.getElementById("tableResult").style.visibility = "visible";

        addRow(parsedBody.Item.name, parsedBody.Item.desc, parsedAuth.Authorizations);
    }).catch(function(error){
        document.getElementById('messageSuccessREAD').style.color = 'red';
        document.getElementById('messageSuccessREAD').innerHTML = 'Role not read';
    });

  });