  //READ
  const login = document.getElementById('LOGIN');
  login.addEventListener('submit', function(e){
    e.preventDefault();

    fetch(linkLoginAPI_POST, {
      method: "POST",
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
      },

      body: JSON.stringify({
      "email": document.getElementById('LOGIN_email').value.trim(),
      "password": document.getElementById('LOGIN_password').value.trim()
      })
    }).then(function(response){
        const responseJSON = response.json();
        return responseJSON;
    }).then(function(data){

        const stringedResponse = JSON.stringify(data);
        const parsedResponse = JSON.parse(stringedResponse);
        
        console.log("Response: " + parsedResponse.body);

        sessionStorage.setItem("firstName", parsedResponse.body.firstName);
        sessionStorage.setItem("lastName", parsedResponse.body.lastName);

        document.getElementById("login-result").innerHTML = sessionStorage.getItem("lastName");
    });
  });