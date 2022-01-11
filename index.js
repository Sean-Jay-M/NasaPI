var dateList = []
year()
fetchData()
function fetchData(){
    try{
      fetch('https://api.nasa.gov/planetary/apod?api_key=GDE3gez5LI92lZk0h8UxWyJVHTz6XyD1ta6OdMlQ')
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
          document.getElementById("image").innerHTML = "<iframe width='560' height='315' id='CORBV' src=" + display + "title='YouTube video player' style='border: 0; display: block; margin-left: auto; margin-right: auto; margin-top: 30px; margin-bottom: 20px;' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe>";
          document.getElementById("error").innerHTML = "<br> This is not an image, but a video ! Enjoy :)";
        }
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
    for(var i = listDate.length - 1; i > 0; i--) {
        var opt = listDate[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        select.appendChild(el);
    }
    dateList = listDate;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

var apodOpen = true;

//this is a faux loading function. It's used to give the user interaction while waiting for different elements to load.
async function loading(time, div, replace){
  apodOpen = false;
  document.getElementById(div).innerHTML = 'loading....';
  await sleep(time);
  document.getElementById(div).innerHTML = replace;
  apodOpen = true;
  document.getElementById(div).click();
}

function newphoto(date){
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
        document.getElementById("image").innerHTML = "<iframe width='560' height='315' id='CORBV' src=" + display + "title='YouTube video player' style='border: 0; display: block; margin-left: auto; margin-right: auto; margin-top: 30px; margin-bottom: 20px;' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe>";
        document.getElementById("error").innerHTML = "<br> This is not an image, but a video ! Enjoy :)";
      }
      loading(1500, "APOD", 'Astronomy Picture Of The Day (APOD)')
    })
  }catch(error){
    document.getElementById("image").innerHTML = "<img src='images/visualdon.gif' id='day_img'>"
    loading(1500, "APOD", 'Astronomy Picture Of The Day (APOD)')
    console.log(error)
  }
}

//open - close on start NEOWS.
var block = true; 

// this is used for elements which require time on page opening such as NEOWS
function loadingblock(){
  document.getElementById("NEOWS").innerHTML = "loading....";
}

function loadingOpen2(){
  document.getElementById("NEOWS").innerHTML = "Near Earth Object Web Service (NEOWS)";
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

//open - close APOD.
var coll = document.getElementsByClassName("collapsible");
var i;
for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    if(apodOpen == false){
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

function neows(dateList){
  loadingblock();
  var dates = dateList;
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
            var xminus= x-1
            var dayString = '"' + day + '"';
            document.getElementById(day).innerHTML += "<td><button type='button' class='Astbutton' onclick='neowsGraph(" + identification + "," + dayString + "); neowsDescription(" + dayString +  "," + xminus + ");" + "neowsPlot(" + dayString + "," + identification + ");  openModal()'>Open</button></td><td>" + identification + "</td><td>" + absoluteMag + "</td><td>" + danger + "</td><td>" + sentry + "</td>";
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
neows(dateList);

var asteroidListMain = {};
var normalRatio = true;
var weirdRatio = 0;

//We're dealing in meters here. Where 1 pixel represents 1 meter. The ratio between M displayed on the graph to real meter is technically 1px (or 1 meter) = 0.0002645833m (real meter)
// For ease of use I used the width of the box field to define the ratio between displayed and real: 4000px (or 4 thousand meters) = 1.06m (real meters) it's also just easier to understand what the user is looking at.
// In essence what this graph displays is rough 4000 times smaller than the real object it is representing/distance it is to display.. 
function neowsGraph(identification, day){
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");
  // The values provided by the API come in kilometers. Therefore the value needs to be multiplied by 1000 to turn it into meters which is the metric I am using.
  var value = (asteroidListMain[day][identification]) * 1000;
  //the Box is intended to represent an area of 500m wide and 250m tall. A fairly basic standard which will work with most, but not all asteroids.
  //if the asteroid will fit into these dimensions.
  if ((value/2) <= 122.5){
    normalRatio = true;
    var fieldWidth1 = 75;
    var fieldHeight1 = 120;
    var xPos1 = 400 //(document.getElementById("myCanvas").width/2) - (fieldWidth/2);
    var yPos1 = (document.getElementById("myCanvas").height/2) - (fieldHeight1/2);
    ctx.beginPath();
    ctx.arc(250, 125, (value/2), 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.rect(xPos1, yPos1, fieldWidth1, fieldHeight1); //85
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 250);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, 250);
    ctx.lineTo(500, 250);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.font = "10px Arial";
    ctx.fillText("250M", 3, 10);
    ctx.font = "10px Arial";
    ctx.fillText("0M", 5, 245);
    ctx.font = "10px Arial";
    ctx.fillText("500M", 467, 245);
  } else {
    // if it does not, this will alter the ratios.
    // It works by dividing the size of both the field and the asteroid by the same value until the asteroid will fit in the box. 
    // Once done it will calculate the new scale and change it accordingly.
    normalRatio = false;
    var calculation = 1;
    var calculate = true;
    var radius = value/2
    while (calculate){
      var finalRadius = radius / calculation;
      if(finalRadius <= 122.5){
        var fieldWidth = 75 / calculation;
        var fieldHeight = 120 / calculation;
        var xPos = 400 //(document.getElementById("myCanvas").width/2) - (fieldWidth/2);
        var yPos = (document.getElementById("myCanvas").height/2) - (fieldHeight/2);
        ctx.beginPath();
        ctx.arc(250, 125, (finalRadius), 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.rect(xPos, yPos, fieldWidth, fieldHeight); //85
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 250);
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, 250);
        ctx.lineTo(500, 250);
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.font = "10px Arial";
        ctx.fillText(250*calculation + "M", 3, 10);
        ctx.font = "10px Arial";
        ctx.fillText("0M", 5, 245);
        ctx.font = "10px Arial";
        ctx.fillText(500*calculation + "M", 467, 245);
        calculate = false;
        weirdRatio = calculation;
      }
      calculation += 1;
    }
  }
}

function neowsDescription(day, asteroid){
  document.getElementById("asteroidDesc").innerHTML = 'Loading Data...';
  var dates = dateList;
  var today = dates[dates.length - 1];
  var pWeek = dates[dates.length - 7];
  var value= "https://api.nasa.gov/neo/rest/v1/feed?start_date=" + pWeek + "&end_date=" + today + "&api_key=GDE3gez5LI92lZk0h8UxWyJVHTz6XyD1ta6OdMlQ"
  fetch(value)
  .then(response=>response.json())
  .then(json=>{
    if (normalRatio){
      document.getElementById("asteroidDesc").innerHTML = '';
      document.getElementById("asteroidDesc").innerHTML += "Diagram on left displays the Asteroid in relation <br> to the size of a Football Field." + "<br><br><span style=' font-weight: bold;'>Asteroid Name: </span>" + json.near_earth_objects[day][asteroid].name + " <br><br> <span style=' font-weight: bold;'>Max Estimate Diameter: </span>" + json.near_earth_objects[day][asteroid].estimated_diameter.kilometers.estimated_diameter_max + "KM"+ "<br><br><span style=' font-weight: bold;'>Field Dimensions:</span> 120m x 75m <br><br>   <span style=' font-weight: bold;'>Graph to Asteroid Scale: </span> 3779 : 1.00";
    } else{
      document.getElementById("asteroidDesc").innerHTML = '';
      var newRatio = 3779*weirdRatio
      document.getElementById("asteroidDesc").innerHTML += "Diagram on left displays the Asteroid in relation <br> to the size of a Football Field." + "<br><br><span style=' font-weight: bold;'>Asteroid Name: </span>" + json.near_earth_objects[day][asteroid].name + " <br><br> <span style=' font-weight: bold;'>Max Estimate Diameter: </span>" + json.near_earth_objects[day][asteroid].estimated_diameter.kilometers.estimated_diameter_max + "KM"+ "<br><br><span style=' font-weight: bold;'>Field Dimensions:</span> 120m x 75m <br><br>  <span style=' font-weight: bold;'>Graph to Asteroid Scale: </span>" + newRatio + ": 1.00";
    }
  })
}

var asteroidListMain2= {};
var asteroidListMain3= {};


//the ratio of graph to distance in AU needs to be looked at and resolved. I believe my thought process may be incorrect.
function neowsPlot(day, identification){
  //the trouble with this plot is visualizing the distances and trying to keep it somewhat in proportion despite being a 500px wide by 1000px height canvas displaying an inconceivable distance.
  //500 px will represent 0.66 astronomical unit, the width of the canvas is 0.66 units. While the height is 1 units. In effect 1px = 0.00133AU
  //for reference one astronomical unit to kilometer ratio is 1:149597870700
  //The sun is officially 1 astronomical units in distance from the earth, this will be used as the basis for visualizing the distance 
  //This ratio will allow for me to display the sun as the reference point. While the earth and sun will NOT be to scale the distance between them will be (mostly)
  // It is from the CENTER of the sun and CENTER of the earth, therefore the edges need not be proportonally correct, just the distances from the cores.
  var c = document.getElementById("myCanvas2");
  var ctx2 = c.getContext("2d");
  var miss_distance = (asteroidListMain2[day][identification]);
  var holding = 0;
  //scaling issues once again, 0.018 is just a happy coincidence for a nice distance for the graph to operate at.
  if (miss_distance >= 0.018){
  var calculationMiss = miss_distance/0.0013
  ctx2.beginPath();
  ctx2.arc(250, 750, 5, 0, 2 * Math.PI);
  ctx2.stroke();
  ctx2.beginPath();
  ctx2.arc(250, 0, 20, 0, 2 * Math.PI);
  ctx2.stroke();
  ctx2.beginPath();
  ctx2.moveTo(0, 0);
  ctx2.lineTo(0, 750);
  ctx2.lineWidth = 2;
  ctx2.stroke();
  ctx2.beginPath();
  ctx2.moveTo(0, 750);
  ctx2.lineTo(500, 750);
  ctx2.lineWidth = 2;
  ctx2.stroke();
  ctx2.font = "10px Arial";
  ctx2.fillText("EARTH", 260, 740);
  ctx2.font = "10px Arial";
  ctx2.fillText("SUN (SOL)", 275, 10);
  ctx2.font = "10px Arial";
  ctx2.fillText("1.00AU", 3, 10);
  ctx2.font = "10px Arial";
  ctx2.fillText("0.00AU", 3, 745);
  ctx2.font = "10px Arial";
  ctx2.fillText("0.66AU", 3, 250);
  ctx2.font = "10px Arial";
  ctx2.fillText("0.66AU", 465, 745);
  ctx2.beginPath();
  ctx2.arc(250, (750 - calculationMiss), 2, 0, 2 * Math.PI);
  ctx2.font = "10px Arial";
  ctx2.fillText("Miss Distance: " + miss_distance + "AU", 90, (750 - calculationMiss));
  ctx2.stroke();
  neowsPlotDesc(true, day, identification, holding);
  } else {
    var doCalculate = true;
    var calculationNum = 1
    while(doCalculate){
      var missTwo = miss_distance * calculationNum;
      if (missTwo >= 0.018){
        var calculationMiss2 = missTwo/0.0013
        ctx2.beginPath();
        ctx2.arc(250, 750, 5, 0, 2 * Math.PI);
        ctx2.stroke();
        ctx2.beginPath();
        ctx2.stroke();
        ctx2.beginPath();
        ctx2.moveTo(0, 0);
        ctx2.lineTo(0, 750);
        ctx2.lineWidth = 2;
        ctx2.stroke();
        ctx2.beginPath();
        ctx2.moveTo(0, 750);
        ctx2.lineTo(500, 750);
        ctx2.lineWidth = 2;
        ctx2.stroke();
        ctx2.font = "10px Arial";
        ctx2.fillText("EARTH", 260, 740);
        ctx2.font = "10px Arial";
        ctx2.fillText((1.00 / calculationNum) + "AU", 3, 10);
        ctx2.font = "10px Arial";
        ctx2.fillText("0.00AU", 3, 745);
        ctx2.font = "10px Arial";
        ctx2.fillText((0.66 / calculationNum) + "AU", 3, 250);
        ctx2.font = "10px Arial";
        ctx2.fillText((0.66 / calculationNum) + "AU", 465, 745);
        ctx2.beginPath();
        ctx2.arc(250, (750 - calculationMiss2), 2, 0, 2 * Math.PI);
        ctx2.font = "10px Arial";
        ctx2.fillText("Miss Distance: " + miss_distance + "AU", 90, (750 - calculationMiss2));
        ctx2.stroke();
        neowsPlotDesc(false, day, identification, calculationNum);
        doCalculate = false;
      }
      calculationNum += 1
    }
  }
}

function neowsPlotDesc(normal, day, identification, calculationNum){
  if(normal){
    document.getElementById("asteroidPlotDesc").innerHTML = '';
    document.getElementById("asteroidPlotDesc").innerHTML += 'Diagram on the left displays the distance between <br> the Asteroid and Earth in Astronomical Units. <br> 1AU = 149597870700KM <br> 1AU is also the distance between Earth and the Sun. <br> The Earth, Sun and Asteroid are not to scale <br> but their distances are. <br><br>' + "<span style=' font-weight: bold;'>Miss Distance: </span>" + asteroidListMain2[day][identification] + "AU<br><br><span style=' font-weight: bold;'>Relative Seed: </span>" + asteroidListMain3[day][identification] + "KMPH" + "<br><br><span style=' font-weight: bold;'>Graph to distance(AU) Ratio: </span> 3779 : 6.6846e-12";
  }else {
    if (calculationNum == 2){
      document.getElementById("asteroidPlotDesc").innerHTML = '';
      document.getElementById("asteroidPlotDesc").innerHTML += 'Diagram on the left displays the distance between <br> the Asteroid and Earth in Astronomical Units. <br> 1AU = 149597870700KM <br> 1AU is also the distance between Earth and the Sun. <br> The Earth, Sun and Asteroid are not to scale <br> but their distances are. <br><br>' + "<span style=' font-weight: bold;'>Miss Distance: </span>" + asteroidListMain2[day][identification] + "AU<br><br><span style=' font-weight: bold;'>Relative Seed: </span>" + asteroidListMain3[day][identification] + "KMPH" + "<br><br><span style=' font-weight: bold;'>Graph to distance(AU) Ratio: </span> 3779 : 3.3423e-12";
  }else if(calculationNum == 3){
    document.getElementById("asteroidPlotDesc").innerHTML = '';
    document.getElementById("asteroidPlotDesc").innerHTML += 'Diagram on the left displays the distance between <br> the Asteroid and Earth in Astronomical Units. <br> 1AU = 149597870700KM <br> 1AU is also the distance between Earth and the Sun. <br> The Earth, Sun and Asteroid are not to scale <br> but their distances are. <br><br>' + "<span style=' font-weight: bold;'>Miss Distance: </span>" + asteroidListMain2[day][identification] + "AU<br><br><span style=' font-weight: bold;'>Relative Seed: </span>" + asteroidListMain3[day][identification] + "KMPH" + "<br><br><span style=' font-weight: bold;'>Graph to distance(AU) Ratio: </span> 3779 : 2.20591e-12";
  }else if(calculationNum == 4){
    document.getElementById("asteroidPlotDesc").innerHTML = '';
    document.getElementById("asteroidPlotDesc").innerHTML += 'Diagram on the left displays the distance between <br> the Asteroid and Earth in Astronomical Units. <br> 1AU = 149597870700KM <br> 1AU is also the distance between Earth and the Sun. <br> The Earth, Sun and Asteroid are not to scale <br> but their distances are. <br><br>' + "<span style=' font-weight: bold;'>Miss Distance: </span>" + asteroidListMain2[day][identification] + "AU<br><br><span style=' font-weight: bold;'>Relative Seed: </span>" + asteroidListMain3[day][identification] + "KMPH" + "<br><br><span style=' font-weight: bold;'>Graph to distance(AU) Ratio: </span> 3779 : 1.67115e-12";
  }else{
    document.getElementById("asteroidPlotDesc").innerHTML = '';
    document.getElementById("asteroidPlotDesc").innerHTML += 'Diagram on the left displays the distance between <br> the Asteroid and Earth in Astronomical Units. <br> 1AU = 149597870700KM <br> 1AU is also the distance between Earth and the Sun. <br> The Earth, Sun and Asteroid are not to scale <br> but their distances are. <br><br>' + "<span style=' font-weight: bold;'>Miss Distance: </span>" + asteroidListMain2[day][identification] + "AU<br><br><span style=' font-weight: bold;'>Relative Seed: </span>" + asteroidListMain3[day][identification] + "KMPH";
  }
}
}

function neowsData(json, day){
  var asteroidList = {};
  var asteroidList2 ={};
  var asteroidList3 ={};
  for(var x = json.near_earth_objects[day].length; x > 0; x--){
    var asteroid = x-1;
    asteroidList[json.near_earth_objects[day][asteroid].id] = json.near_earth_objects[day][asteroid].estimated_diameter.kilometers.estimated_diameter_max;
    asteroidList2[json.near_earth_objects[day][asteroid].id] = json.near_earth_objects[day][asteroid].close_approach_data[0].miss_distance.astronomical;
    asteroidList3[json.near_earth_objects[day][asteroid].id] = json.near_earth_objects[day][asteroid].close_approach_data[0].relative_velocity.kilometers_per_hour;
  }
  asteroidListMain[day] = asteroidList;
  asteroidListMain2[day] = asteroidList2;
  asteroidListMain3[day] = asteroidList3;
}

//opens & closes the modal for NEOWS
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];

function openModal(){
  modal.style.display = "block";
}

span.onclick = function() {
  modal.style.display = "none";
  document.getElementById("asteroidDesc").innerHTML = "";
  const canvas = document.getElementById('myCanvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    document.getElementById("asteroidDesc").innerHTML = "";
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const canvas2 = document.getElementById('myCanvas2');
    const ctx2 = canvas2.getContext('2d');
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
  }
}

