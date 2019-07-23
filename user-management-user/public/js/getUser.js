  //READ
function getUser(userId){
  fetch('https://njy6q7lc8a.execute-api.eu-central-1.amazonaws.com/dev/readUser?userId=' + '5d2dab3a8196400dfccc1f', {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(function(response){
      const responseJSON = response.json();
      return responseJSON;
  }).then(function(data){
      try{
        const stringedResponse = JSON.stringify(data);
        const parsedResponse = JSON.parse(stringedResponse);
        const parsedBody = JSON.parse(parsedResponse.body);

        document.getElementById('PROFILE_userId').innerHTML = parsedBody.Item.userId;
        document.getElementById('PROFILE_userId').value = parsedBody.Item.userId;
        document.getElementById('PROFILE_firstName').innerHTML = parsedBody.Item.firstName;
        document.getElementById('PROFILE_firstName').value = parsedBody.Item.firstName;
        document.getElementById('PROFILE_lastName').innerHTML = parsedBody.Item.lastName;
        document.getElementById('PROFILE_lastName').value = parsedBody.Item.lastName;
        document.getElementById('PROFILE_date').innerHTML = parsedBody.Item.date;
        document.getElementById('PROFILE_date').value = parsedBody.Item.date;
        document.getElementById('PROFILE_role').innerHTML = parsedBody.Item.role;
        document.getElementById('PROFILE_group').innerHTML = parsedBody.Item.group;
        document.getElementById('PROFILE_email').innerHTML = parsedBody.Item.email;
        document.getElementById('PROFILE_email').value = parsedBody.Item.email;

        var selectRole = document.getElementById("PROFILE_role");
        var optionRole = document.createElement("option");
        optionRole.text = parsedBody.Item.role;
        selectRole.add(optionRole);

        var selectGroup = document.getElementById("PROFILE_group");
        var optionGroup = document.createElement("option");
        optionGroup.text = parsedBody.Item.group;
        selectGroup.add(optionGroup);
      }
      catch(e){
        window.location.href = '/signin';
      }
  });
};