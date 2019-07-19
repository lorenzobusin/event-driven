function getAllAuths(elementId){

    fetch(linkGetAllAuths_GET, {
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

        for (i = 0; i < parsedBody.Count; i++) {
          var newListItem = document.createElement("li"); // Create a <li> node
          newListItem.innerHTML = '<input type="button" class="btn-addAuth" value="+" id="btn-auth-'+ i + '" onclick=\'addAuth("' + elementId + '", "' + parsedBody.Items[i].name + '", "btn-auth-' + i + '")\'/><label>' + parsedBody.Items[i].name + '</label>';
          document.getElementById("ul-Auth").appendChild(newListItem); // Append <li> to <ul>
        }
    });

}


  