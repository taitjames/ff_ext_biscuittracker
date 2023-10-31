var yesterdayDate = new Date();
yesterdayDate.setDate(yesterdayDate.getDate()-1);
const yesterday =  new Date(yesterdayDate.toString().substring(0, 15));

const upcomingGames = document.getElementById('upcoming_games');

const pastGames = document.getElementById('previous_games');

function createUpcomingGamesTable(data) {
    for (let date of data.dates) {
        let dateObj = Date.parse(date.date);
        if (isDateBeforeToday(dateObj)) {
            addDateToTable(date.games[0], pastGames);
        } else {
            addDateToTable(date.games[0], upcomingGames);
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

fetch("./schedule.json")
    .then(Response => {
        return Response.json();
    }).then(data => {
        createUpcomingGamesTable(data);
    });

// https://statsapi.web.nhl.com/api/v1/schedule?expand=schedule.brodcasts&teamId=24&startDate=2023-09-11&endDate=2024-06-25
