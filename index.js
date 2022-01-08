fetchData()
year()
function fetchData(){
    try{
      fetch('https://api.nasa.gov/planetary/apod?api_key=GDE3gez5LI92lZk0h8UxWyJVHTz6XyD1ta6OdMlQ')
      .then(response=>response.json())
      .then(json=>{
        console.log(json)
        var title = json.title;
        var description = json.explanation;
        document.getElementById("image").innerHTML += "<img src='" + json.url + "' id='day_img'>";
        document.getElementById("title").innerHTML = title;
        document.getElementById("description").innerHTML = description;
      })
    }catch(error){
      console.log(error)
    }
  }


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
  return listDate
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//this is a faux loading function. It's used to give the user interaction while waiting for different elements to load.
async function loading(time, div, replace){
  document.getElementById(div).innerHTML = 'loading....';
  await sleep(time);
  document.getElementById(div).innerHTML = replace;
  document.getElementById(div).click();
}

async function newphoto(date){
  document.getElementById("APOD").click();
  var newapi = 'https://api.nasa.gov/planetary/apod?api_key=GDE3gez5LI92lZk0h8UxWyJVHTz6XyD1ta6OdMlQ';
  newapi += "&date="
  newapi += date.value+ "&";
  console.log(newapi);
  try{
    fetch(newapi)
    .then(response=>response.json())
    .then(json=>{
      console.log(json);
      var display = json.url;
      var title = json.title;
      var description = json.explanation;
      document.getElementById("error").innerHTML = "";
      document.getElementById("image").innerHTML = "<img src='" + display + "' id='day_img'>";
      document.getElementById("title").innerHTML = title;
      document.getElementById("description").innerHTML = description;
      var displaystring = String(display);
      console.log(displaystring);
      // this is to deal with CORB issues, in this API it is fairly clear most issues are caused by linking to youtube
      if(displaystring.includes("youtube")){
        console.log("Will cause CROB");
        document.getElementById("image").innerHTML = "<img src='images/visualdon.gif' id='day_img'>";
        document.getElementById("error").innerHTML = "<br> THIS IMAGE IS NOT ACCESSIBLE DUE TO CORB. But you can still read the details :)"
      }
      loading(1500, "APOD", 'Astronomy Picture Of The Day')
    })
  }catch(error){
    document.getElementById("image").innerHTML = "<img src='images/visualdon.gif' id='day_img'>"
    loading(1500, "APOD", 'Astronomy Picture Of The Day')
    console.log(error)
  }
}

//open - close on start NEOWS.
var block = true; 

// this is used for elements which require time on page opening such as NEOWS
function loadingbloack(){
  document.getElementById("NEOWS").innerHTML = "loading....";
}

function loadingOpen2(){
  document.getElementById("NEOWS").innerHTML = "Near Earth Object Web Service";
  block = false;
}


var coll = document.getElementsByClassName("NEOWSC");
var y;
for (y = 0; y < coll.length; y++) {
  coll[y].addEventListener("click", function() {
    console.log(block);
    if (block == false){
    } else {
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.maxHeight){
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      }
    }
  });
}

//open - close.
var coll = document.getElementsByClassName("collapsible");
var i;
for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
}

function neows(){
  loadingbloack();
  var dates = year();
  var today = dates[dates.length - 1];
  var pWeek = dates[dates.length - 7];
  var lastweek = dates.slice(-8);
  var value= "https://api.nasa.gov/neo/rest/v1/feed?start_date=" + pWeek + "&end_date=" + today + "&api_key=GDE3gez5LI92lZk0h8UxWyJVHTz6XyD1ta6OdMlQ"
  try{
    fetch(value)
    .then(response=>response.json())
    .then(json=>{
      console.log(json)
      for(var i = lastweek.length - 1; i > 0; i--){
        var day = lastweek[i];
        if (json.near_earth_objects.hasOwnProperty(day)){
          document.getElementById("tables").innerHTML += "<table class='neowsTables' id= '" + day + "'><tr><th>" + day + "</th><th>I.D.</th><th>Absolute magnitude</th><th>Potentially Dangerous</th><th>Sentry object</th></tr>";
          for(var x = json.near_earth_objects[day].length; x > 0; x--){
            document.getElementById("tables").innerHTML += "<tr>";
            var absoluteMag = json.near_earth_objects[day][x-1].absolute_magnitude_h;
            var identification = json.near_earth_objects[day][x-1].id;
            var danger = json.near_earth_objects[day][x-1].is_potentially_hazardous_asteroid;
            var sentry = json.near_earth_objects[day][x-1].is_sentry_object;
            var dataset = json;
            var xminus= x-1
            var dayString = '"' + day + '"';
            document.getElementById(day).innerHTML += "<td><button type='button' class='Astbutton' onclick='neowsGraph(" + identification + "," + dayString + "); neowsDescription(" + dayString +  "," + xminus + "); openModal()'>Open</button></td><td>" + identification + "</td><td>" + absoluteMag + "</td><td>" + danger + "</td><td>" + sentry + "</td>";
            document.getElementById(day).innerHTML += "</tr>";
          }
        }
        document.getElementById("tables").innerHTML += "</table><div id='" + day +"'></div>";
        if (json.near_earth_objects.hasOwnProperty(day)){
          neowsData(json, day);
        }
        loadingOpen2();
      }
    })
  }catch(error){
    console.log(error)
  }
}
neows()

var asteroidListMain = {};

function neowsGraph(identification, day){
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");
  var value = (asteroidListMain[day][identification]) * 1000;
  //if it is too large to fit in the box
  if ((value/2) <= 122.5){
    var fieldWidth1 = 85;
    var fieldHeight1 = 125;
    var xPos1 = (document.getElementById("myCanvas").width/2) - (fieldWidth1/2);
    var yPos1 = (document.getElementById("myCanvas").height/2) - (fieldHeight1/2);
    ctx.beginPath();
    ctx.arc(250, 125, (value/2), 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.rect(xPos1, yPos1, fieldWidth1, fieldHeight1); //85
    ctx.stroke();
  } else {
    // will alter the ratios 
    var calculation = 1;
    var calculate = true;
    var radius = value/2
    while (calculate){
      var finalRadius = radius / calculation;
      if(finalRadius <= 122.5){
        var fieldWidth = 85 / calculation;
        var fieldHeight = 125 / calculation;
        var xPos = (document.getElementById("myCanvas").width/2) - (fieldWidth/2);
        var yPos = (document.getElementById("myCanvas").height/2) - (fieldHeight/2);
        ctx.beginPath();
        ctx.arc(250, 125, (finalRadius), 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.rect(xPos, yPos, fieldWidth, fieldHeight); //85
        ctx.stroke();
        calculate = false;
      }
      calculation += 1;
    }
  }
}

function neowsDescription(day, asteroid){
  var dates = year();
  var today = dates[dates.length - 1];
  var pWeek = dates[dates.length - 7];
  var value= "https://api.nasa.gov/neo/rest/v1/feed?start_date=" + pWeek + "&end_date=" + today + "&api_key=GDE3gez5LI92lZk0h8UxWyJVHTz6XyD1ta6OdMlQ"
  fetch(value)
  .then(response=>response.json())
  .then(json=>{
    document.getElementById("asteroidDesc").innerHTML = json.near_earth_objects[day][asteroid].estimated_diameter.kilometers.estimated_diameter_max;
  })
}

function neowsData(json, day){
  var asteroidList = {}
  for(var x = json.near_earth_objects[day].length; x > 0; x--){
    var asteroid = x-1;
    asteroidList[json.near_earth_objects[day][asteroid].id] = json.near_earth_objects[day][asteroid].estimated_diameter.kilometers.estimated_diameter_max;
  }
  asteroidListMain[day] = asteroidList;
}

//opens & closes the modal for NEOWS
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];

function openModal(){
  modal.style.display = "block";
}

span.onclick = function() {
  modal.style.display = "none";
  const canvas = document.getElementById('myCanvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}
