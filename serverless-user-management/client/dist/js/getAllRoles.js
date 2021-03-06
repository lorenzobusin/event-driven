function getAllRoles(elementId){

    fetch(linkGetAllRoles_GET, {
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
        var getItems;

        for (i = 0; i < parsedBody.Count; i++) {
          getItems += "<option value=" + (parsedBody.Items[i].name).replace(/\s/g, '_') + ">" + parsedBody.Items[i].name + "</option>";
        }
        document.getElementById(elementId).innerHTML = getItems;
    });

}


  