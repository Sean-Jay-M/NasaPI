function fetchData(){
    try{
      fetch('https://api.nasa.gov/planetary/apod?api_key=GDE3gez5LI92lZk0h8UxWyJVHTz6XyD1ta6OdMlQ')
      .then(response=>response.json())
      .then(json=>{
        console.log(json)
        document.getElementById("image").innerHTML += "<img src='" + json.url + "' id='day_img'>"
      })
    }catch(error){
      console.log(error)
    }
  }
  fetchData()
  year()



function year(){
    const listDate = [];
    const startDate ='1995-06-16';
    var today = new Date();
    const endDate = new Date().toISOString().slice(0, 10)
    const dateMove = new Date(startDate);
    let strDate = startDate;

    while (strDate < endDate) {
    strDate = dateMove.toISOString().slice(0, 10);
    listDate.push(strDate);
    dateMove.setDate(dateMove.getDate() + 1);
    };

    var select = document.getElementById("selectNumber"); 
    console.log(listDate);
    for(var i = listDate.length - 1; i > 0; i--) {
        var opt = listDate[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        select.appendChild(el);
    }
}

function newphoto(date){
  var newapi = 'https://api.nasa.gov/planetary/apod?api_key=GDE3gez5LI92lZk0h8UxWyJVHTz6XyD1ta6OdMlQ';
  newapi += "&date="
  newapi += date.value+ "&";
  console.log(newapi);
  try{
    console.log("In try");
    fetch(newapi)
    .then(response=>response.json())
    .then(json=>{
      console.log(json)
      document.getElementById("image").innerHTML += "<img src='" + json.url + "' id='day_img'>"
    })
  }catch(error){
    console.log(error)
  }
}
