setInterval(function(){
    console.log("event loop passed");
    /*
        This is your event loop. I've set it to run code every 1 minute.

        Things like live scores, upcoming notifications etc will have to go through this, as web pages are static unless told otherwise.
    */
}, 60 * 1000);

var yesterdayDate = new Date();

let teams = [

"Anaheim Ducks",
"Arizona Coyotes",
"Boston Bruins",
"Buffalo Sabres",
"Calgary Flames",
"Carolina Hurricanes",
"Chicago Blackhawks",
"Colorado Avalanche",
"Columbus Blue Jackets",
"Dallas Stars",
"Detroit Red Wings",
"Edmonton Oilers",
"Florida Panthers",
"Los Angeles Kings",
"Minnesota Wild",
"Montreal Canadiens",
"Nashville Predators",
"New Jersey Devils",
"New York Islanders",
"New York Rangers",
"Ottawa Senators",
"Philadelphia Flyers",
"Pittsburgh Penguins",
"San Jose Sharks",
"St. Louis Blues",
"Tampa Bay Lightning",
"Toronto Maple Leafs",
"Vancouver Canucks",
"Vegas Golden Knights",
"Washington Capitals",
"Winnipeg Jets"

];

yesterdayDate.setDate(yesterdayDate.getDate()-1);
const yesterday =  new Date(yesterdayDate.toString().substring(0, 15));

const upcomingGames = document.getElementById('upcoming_games');

const pastGames = document.getElementById('previous_games');

let selectpop = document.getElementById("teamselect"); // Pick up the select box

selectpop.onchange = function(){setCookie()}; // Check for changes to that box

for (let i = 0; i < teams.length; i++){ // For every team in the teams array at the top, add it to the selection box. This is better than doing it manually on the HTML as you can change the teams in the array.
    var t = teams[i];
    var el = document.createElement("option");
    el.textContent = t;
    el.value = t;
    selectpop.appendChild(el);
}

function deleteAllRows(){

    let rowCountup = upcomingGames.rows.length;

    for (let i = 1; i < rowCountup; i++){
        upcomingGames.deleteRow(1)
    }

    let rowCountpast = pastGames.rows.length;

    for (let i = 1; i < rowCountpast; i++){
        pastGames.deleteRow(1)
    }

}

/*
    For some reason the way I do cookies (below) does not work with extensions, but works on webpages. Might need to use the inbuilt firefox/chrome way.

    All this does is save the value at the top each time you refresh so you keep the settings. But I don't know if you can pass variables through some other means with extensions?
*/

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "None (Show all Teams)";
}

function setCookie(){ // Sets the cookie and refreshes the tables when you change the value on the selection box 
    document.cookie = "selectv=" + selectpop.value + ";path=/";
    deleteAllRows();
    refreshtable();
}

function pullCookie(){
    selectpop.value = getCookie("selectv");
}

function createUpcomingGamesTable(data) {
    for (let date of data.dates) {
        let dateObj = Date.parse(date.date);
        if (isDateBeforeToday(dateObj)) {

            for (let i = 0; i < date.games.length; i++){ // Go through every game in the manifest
                if (date.games[i].teams.away.team.name == selectpop.value || 
                    date.games[i].teams.home.team.name == selectpop.value || 
                    selectpop.options[selectpop.selectedIndex].text == "None (Show all Teams)"){ // If the team name matches the drop down add that game to the table, or show all if none selected
                    addDateToTable(date.games[i], pastGames);
                }

            }

        } else {
            for (let i = 0; i < date.games.length; i++){

                if (date.games[i].teams.away.team.name == selectpop.value || 
                    date.games[i].teams.home.team.name == selectpop.value || 
                    selectpop.options[selectpop.selectedIndex].text == "None (Show all Teams)"){
                    addDateToTable(date.games[i], upcomingGames);
                }

            }
        }
    }
}

function addDateToTable(gameInfo, table) {
    var row = table.insertRow();
    let gameDate = new Date(gameInfo.gameDate);
    var dateCell = row.insertCell();
    var timeCell = row.insertCell();
    var homeCell = row.insertCell();
    var awayCell = row.insertCell();

    dateCell.innerHTML = gameDate.toLocaleString('default', { month: 'long' }) + " " +
        gameDate.toLocaleString('default', { day: 'numeric' });
    timeCell.innerHTML = gameDate.toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit' });
    homeCell.innerHTML = gameInfo.teams.home.team.name;
    awayCell.innerHTML = gameInfo.teams.away.team.name;
}

function isDateBeforeToday(date) {
    return date < yesterday;
}

// fetch added to a function so you can call it on demand
function refreshtable(){
    fetch("./schedule.json")
    .then(Response => {
        return Response.json();
    }).then(data => {
        createUpcomingGamesTable(data);
    });
}

// https://statsapi.web.nhl.com/api/v1/schedule?expand=schedule.brodcasts&startDate=2023-09-11&endDate=2024-06-25

pullCookie();
refreshtable();