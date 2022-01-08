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
// this is used for elements which require time on page opening such as NEOWS
function loadingOpen(div){
  document.getElementById(div).innerHTML = 'loading....';
}

function loadingOpen2(div, replace){
  document.getElementById(div).innerHTML = replace;
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
      loading(1500)
    })
  }catch(error){
    document.getElementById("image").innerHTML = "<img src='images/visualdon.gif' id='day_img'>"
    loading(1500, "APOD", 'Astronomy Picture Of The Day')
    console.log(error)
  }
}

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
          loadingOpen("NEOWS")
          document.getElementById("tables").innerHTML += "<table class='neowsTables' id= '" + day + "'><tr><th>Absolute magnitude</th><th>I.D.</th><th>Potentially Dangerous</th><th>Sentry object</th></tr>";
          for(var x = json.near_earth_objects[day].length; x > 0; x--){
            document.getElementById("tables").innerHTML += "<tr>";
            var absoluteMag = json.near_earth_objects[day][x-1].absolute_magnitude_h;
            var identification = json.near_earth_objects[day][x-1].id;
            var danger = json.near_earth_objects[day][x-1].is_potentially_hazardous_asteroid;
            var sentry = json.near_earth_objects[day][x-1].is_sentry_object;
            document.getElementById(day).innerHTML += "<td>" + absoluteMag + "</td><td>" + identification + "</td><td>" + danger + "</td><td>" + sentry + "</td>";
            document.getElementById(day).innerHTML += "</tr>";
            console.log(neows);
          }
        }
        document.getElementById("tables").innerHTML += "</table>";
        loadingOpen2("NEOWS", 'Near Earth Object Web Service')
      }
    })
  }catch(error){
    console.log(error)
  }
}
neows()


