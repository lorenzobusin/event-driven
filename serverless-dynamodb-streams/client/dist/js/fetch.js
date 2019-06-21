fetch("https://mrh8oqh3li.execute-api.eu-central-1.amazonaws.com/prod/", {
  method: "post",
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },

  //make sure to serialize your JSON body
  body: JSON.stringify({
    "userId": "2",
    "firstName": "Lorenzo",
    "lastName": "Busin",
    "username": "lbusin"
  })
})
.then(function(res){ 
    console.log(res) 
});

/*(async () => {
  const rawResponse = await fetch("https://mrh8oqh3li.execute-api.eu-central-1.amazonaws.com/prod/", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({a: 1, b: 'Textual content'})
  });
  const content = await rawResponse.json();

  console.log(content);
})();*/
