//APOD - this section is pretty easy to understand, not much documentation required.
var dateList = []
year();
fetchData();
inSightFetch();
fireball();
neows(dateList);

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

//this is a faux loading function. It's used to give the user interaction while waiting for different elements to load. Used for APOD and Mars Photos.
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
  document.getElementById("APOD").innerHTML = 'loading....';
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
    loading(1500, "APOD", 'Failed to Load.')
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

//NEOWS Section, I have programmed it to only select the last seven days. I believe I have shown competence in allowing the user select a date range using the APOD. It would be silly to do it again. 
//There are more complicated calculations, and ways to gather data from the API in this section.
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
      //Basically I dont want to display anything closer than this on the canvas. As the two circles begin to merge. 
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

//InSight section
// InSight Dictionaries: (They'll be short but necessary)
var InSightData = {};
//This API has a habit of not loading sometimes, this could honestly be due to the Rover being unable to send data due to a number of reasons. 
function inSightFetch(){
  document.getElementById("InSight").innerHTML = "loading...";
  try{
    fetch('https://api.nasa.gov/insight_weather/?api_key=GDE3gez5LI92lZk0h8UxWyJVHTz6XyD1ta6OdMlQ&feedtype=json&ver=1.0')
    .then(response=>response.json())
    .then(json=>{
      console.log(json);
      solKey = json.sol_keys[0];
      if (typeof solKey == 'undefined'){
        document.getElementById("ErrorMsg").innerHTML = " WARNING: Some or all of the Data for the current Day(Sol) has not been received from the Rover or API. Possibly due to intense weather conditions on Mars.";
        console.log("Visit this link to easily view if data present: " + "https://api.nasa.gov/assets/insight/insight_mars_wind_rose.html" + " This message has been shown due to a lack of Data from the API or Rover.");
        document.getElementById("InSightDesc").innerHTML = "";
        document.getElementById("TempInfo").innerHTML = "";
        document.getElementById("myCanvas3").remove();
        document.getElementById("InSight").innerHTML = "Failed to Load. Click for more info.";
      }else{
        //Put these into tables because the variables will change and fuck everything up. Bit of a waste of time but ah well ua loser. 
        document.getElementById("InSightLine1").innerHTML =  "<table><tr><td><span style=' font-weight: bold;'>Sol/Days Since Rover Touchdown: </span><br>" +  solKey + "</td><td><span style=' font-weight: bold;'>Sol Season:</span> </span>" + json[solKey].Season + "</td></tr><tr><td><span style=' font-weight: bold;'>Northern Season: </span><br>" + json[solKey].Northern_season + "</td><td><span style=' font-weight: bold;'>Southern Season:</span><br>" + json[solKey].Southern_season + "</td></tr></table>";
        document.getElementById("InSightLine2").innerHTML =  "<table><tr><td><span style=' font-weight: bold;'>Minimum Temperature: </span>" + Math.round(((json[solKey].AT.mn - 32) * 5/9))  + "</td><td><span style=' font-weight: bold;'>Maximum Temperature: </span>" +  Math.round(((json[solKey].AT.mx - 32) * 5/9))  + "</td></tr></table>"
        InSightData["avTemp"] = json[solKey].AT.av
        InSightData["mnTemp"] = json[solKey].AT.mn
        InSightData["mxTemp"] = json[solKey].AT.mx
        //ct may not be used, but is added in incase I find a use for it.
        InSightData["ctTemp"] = json[solKey].AT.ct
        //Insert other weather data here.

        //call the graph
        temperatureGraph();
      }
    })
  document.getElementById("InSight").innerHTML = "InSight: Mars Weather Service";
  }catch(error){
    console.log(error)
    document.getElementById("InSight").innerHTML = "Failed to Load.";
  }
}

//The temperature graph is 550 pixels wide. The max temperature on mars is 70 degerees F while the min is -195. This is converted to celsius so the range is -125 to 20. Therefore 150 to 150 works fine. 
// I really don't like F as a metric. Therefore I changed it to Celsius, as 0 holds little meaning in farenheit, although thee are other better metrics I understand.
//one pixel is one degree.
function temperatureGraph(){
  var c = document.getElementById("myCanvas3");
  var ctx3 = c.getContext("2d");
  var ctx4 = c.getContext("2d")
  //Draw the graph.
  ctx3.beginPath();
  ctx3.moveTo(100, 100);
  ctx3.lineTo(400, 100);
  ctx3.stroke();
  ctx3.lineWidth = 2;
  ctx3.beginPath();
  ctx3.moveTo(100, 110);
  ctx3.lineTo(100, 90);
  ctx3.stroke();
  ctx3.beginPath();
  ctx3.moveTo(400, 110);
  ctx3.lineTo(400, 90);
  ctx3.stroke();
  ctx3.font = "15px Arial";
  ctx3.fillText("AVERAGE TEMPERATURE", 150, 20);
  ctx4.font = "10px Arial";
  ctx4.fillText("-150C", 60, 104);
  ctx4.fillText("+150C", 410, 104);
  ctx4.beginPath();
  ctx4.moveTo(250, 110);
  ctx4.lineTo(250, 90);
  ctx4.stroke();
  //Implement the different recordings for the day.
  //Average temperature, if greater than 0 or equal to zero add, if less than 
  var DayTemp =  Math.round(((InSightData["avTemp"] - 32) * 5/9)); 
  console.log(DayTemp);
  if (DayTemp > 0){
    var DayTempLine = 250 + DayTemp;
    ctx4.beginPath();
    ctx4.moveTo(DayTempLine, 110);
    ctx4.lineTo(DayTempLine, 90);
    ctx4.stroke();
    ctx4.font = "10px Arial";
    ctx4.fillText(DayTemp+"C", (DayTempLine+5), 110);
  } else {
    var DayTempLine = 250 + DayTemp;
    ctx4.beginPath();
    ctx4.moveTo(DayTempLine, 100);
    ctx4.lineTo(DayTempLine, 90);
    ctx4.stroke();
    ctx4.font = "10px Arial";
    ctx4.fillText(DayTemp+"C", (DayTempLine-12), 110);
  }
}

//SSD/CNEOS Section 
//Fireball

const fireballs = {};

function fireball(){
  document.getElementById("SSD").innerHTML = "loading...";
  try{
    fetch('https://ssd-api.jpl.nasa.gov/fireball.api?limit=20')
    .then(response=>response.json())
    .then(json=>{
      console.log(json);
      for(var i = json.data.length - 1; i > -1; i--){
        fireballs[i] = json.data[i];
      }
      fireballsDraw();
    })
    document.getElementById("SSD").innerHTML = "Solar System Dynamics and Center for Near-Earth Object Studies";
  }catch(error){
    console.log(error)
    document.getElementById("SSD").innerHTML = "Failed to Load.";
  }
}

//Prep for the map development.
//Latitudes Range from -90 to 90. They are horizontal. 0 is the equator, fairly easy unlike Longitudes. 
//Longitudes range from -180 to 180. 0 Longitude goes right through Greenwhich England.
//I cannot afford any of the mapping library options online, and therefore I will not purchase any
//that -90 to 90 is 180. -180 to 80 is 260. Otherwise known as 90n and 90s and 180w and 180e
//The map I have chosen has the mercator projection and has the dimensions of 1024 x 550. This unfortunately is a bit not great ! 
// 550/180 = 3.06 . So roughly speaking every 3 verticle pixels is a new latitude. 
// 1024/360 = 2.84. Therefore for every 3 horizontal pixels we have a new longitude. 
//I understand that simply projecting a globe onto a flat surface is not exactly easy, and then adapting the coordinates isn't easy either. I understand this is somewhat crude but I am trusting these are close to precision. With a 80% precision.
//The map I chose also doesnt have the antarctic lol and definitely isn't the most accurate but listen we're going for something somewhat close. 
// 0 longitude is 478px. 0 latitude is 308.
//This has been tested, you can view the position in the phot0 files of Fireball1 to the official nasa map.
//Impact energy colours: [-1.0]Dark Blue [0.5] lightblue, [0.0] baby blue,  [0.5] Green, [1] Yellow, [1.5]Orange, [2.0]Dark Orange, [2.5]Red. 
function fireballsDraw(){
  var c = document.getElementById("myCanvas4");
  var ctx5 = c.getContext("2d");
  console.log(fireballs);
  var fireballNum = 1;
  document.getElementById("SSDTables").innerHTML += "<table class='neowsTables' id='SSDTABLE'><tr>" + "<th>I.D.</th><th>Date & Time</th><th>Total Impact Energy</th><th>Altitude</th><th>Velocity</th></tr>";
  for (const [key, value] of Object.entries(fireballs)) {
    var dataSet = value
    //remove any fireballs with incomplete data to map.
    if(dataSet[3] == null || dataSet[5] == null){
      fireballNum += 1;
    } else {
    var date = dataSet[0];
    var latitude = dataSet[3];
    var latDir = dataSet[4];
    var longitude = dataSet[5];
    var longDir = dataSet[6];
    var impactE = dataSet[2];
    var altitude = dataSet[7];
    var velocity = dataSet[8];
    var latValue = 0;
    var longValue = 0;
    var colour = '';
    //Yea due to certain calculation issues checks are in place to ensure nothing goes haywire.
    if (latDir == 'N'){
       latValue = (308 - Math.round(latitude*2.84))
       if(latValue < 20){
        latValue = 21;
       }
    } else {
       latValue = (308 + Math.round(latitude*2.84));
       if(latValue > 530){
        latValue = 529;
       }
    }

    if(longDir == 'E'){
      longValue = Math.round(478 + (longitude*3.06))
      if(longValue > 1004){
        longValue = 1003;
      }
    } else {
      longValue = Math.round(478 - (longitude*3.06))
      if(longValue < 20){
        longValue = 21;
      }
    }

    if(impactE <= -1.0){
      colour='#000080'
    } else if(impactE > -1.0 && impactE <= -0.5){
      colour='#0000FF';
    } else if(impactE > -0.5 && impactE <= 0) { 
      colour='#00FFFF';
    } else if(impactE > 0 && impactE <= 0.5) {
      colour='#00FF00';
    } else if(impactE > 0.5 && impactE <= 1){
      colour='#FFFF00';
    } else if(impactE > 1 && impactE <= 1.5){
      colour='#ff7f50';
    } else if(impactE > 1.5 && impactE <= 2){
      colour='#ff8c00';
    } else if(impactE > 2){
      colour='#b22222';
    }

    ctx5.beginPath();
    ctx5.arc(longValue, latValue, 10, 0, 2 * Math.PI, false);
    ctx5.fillStyle = colour;
    ctx5.fill();
    ctx5.lineWidth = 1;
    ctx5.strokeStyle = '#000000';
    ctx5.stroke();
    if(fireballNum < 10){
    ctx5.font = "10px Arial";
    ctx5.strokeText(fireballNum, (longValue-3), (latValue+4));
    } else {
      ctx5.font = "10px Arial";
      ctx5.strokeText(fireballNum, (longValue-6), (latValue+4));
    }
    document.getElementById("SSDTABLE").innerHTML += "<tr><td>" + fireballNum + "</td><td>" +  date + "</td><td>" + impactE + "</td><td>" + altitude + " km</td><td>" + velocity + " km/s</td></tr>";
    fireballNum += 1; 
    }
  }
  document.getElementById("SSDTABLE").innerHTML += "</table>"
  /* activate to see 0 long and 0 lat 
  ctx5.beginPath();
  ctx5.moveTo(478, 500);
  ctx5.lineTo(478, 10);
  ctx5.stroke();
  ctx5.beginPath();
  ctx5.moveTo(0, 308);
  ctx5.lineTo(1000, 308);
  ctx5.stroke();
  */
}

/* Sentry will go here, will swing back around to add it in fully
function Sentry(){
  document.getElementById("SSD").innerHTML = "loading...";
  try{
    fetch('https://ssd-api.jpl.nasa.gov/sentry.api?days=20')
    .then(response=>response.json())
    .then(json=>{
      console.log(json);
    })
    document.getElementById("SSD").innerHTML = "Solar System Dynamics and Center for Near-Earth Object Studies";
  }catch(error){
    console.log(error)
    document.getElementById("SSD").innerHTML = "Failed to Load.";
  }
}
*/

// Mars Rover Photos.

roverDates(dateList);

function roverDates(listDate){
  console.log(dateList);
  var select = document.getElementById("selectNumber2"); 
  for(var i = listDate.length - 1; i >  (listDate.length-8); i--) {
      var opt = listDate[i];
      var el = document.createElement("option");
      el.textContent = opt;
      el.value = opt;
      select.appendChild(el);
  }
}