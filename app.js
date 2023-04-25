console.log("Hello world");



var PositionSelector = document.querySelector("#position-selector");
var ShowStats = document.querySelector("#show-stats");
PositionSelector.addEventListener("change", ShowHideStats);
var Data;
var ShowStatsSelector = document.querySelector("#show-stats-selector");


function UpdatePlayerOptions() {
    var Value = PositionSelector.value;
    var You = document.querySelector("#your-selector");
    var Opp = document.querySelector("#opponent-selector");
    You.innerHTML = "";
    Opp.innerHTML = "";

    if(Value == "shooter") {
        Data["Goalies"].forEach(element => {
            var Option = document.createElement("option");
            Option.value = element["Name"];
            Option.innerHTML = element["Name"];
            Opp.appendChild(Option);
        })
        Data["Shooters"].forEach(element => {
            var Option = document.createElement("option");
            Option.value = element["Name"];
            Option.innerHTML = element["Name"];
            You.appendChild(Option);
        })
    } else if(Value == "goalie") {
        Data["Goalies"].forEach(element => {
            var Option = document.createElement("option");
            Option.value = element["Name"];
            Option.innerHTML = element["Name"];
            You.appendChild(Option);
        })
        
        Data["Shooters"].forEach(element => {
            var Option = document.createElement("option");
            Option.value = element["Name"];
            Option.innerHTML = element["Name"];
            Opp.appendChild(Option);
        })
    }
    Opp.addEventListener("change", ShowHideStats);
    PopulateUpdatePlayerBoth();
}

function PopulateUpdatePlayerSelector() {
    var selector = document.querySelector("#update-select");
    selector.innerHTML = "";
    Data["Goalies"].forEach(element => {
        var Option = document.createElement("option");
        Option.value = element["Name"];
        Option.innerHTML = element["Name"];
        selector.appendChild(Option);
    })
    Data["Shooters"].forEach(element => {
        var Option = document.createElement("option");
        Option.value = element["Name"];
        Option.innerHTML = element["Name"];
        selector.appendChild(Option);
    })
}
function PopulateUpdatePlayerAttributes() {
    var selector = document.querySelector("#update-select");
    var player = selector.value;
    //console.log("PopulateUpdatePlayerAttributes() player", player);

    var name = document.querySelector("#update-name");
    var col1 = document.querySelector("#update-primary-color");
    var col2 = document.querySelector("#update-secondary-color");
    var col3 = document.querySelector("#update-tertiary-color");
    var tl = document.querySelector("#update-tl-chance");
    var tr = document.querySelector("#update-tr-chance");
    var br = document.querySelector("#update-br-chance");
    var bl = document.querySelector("#update-bl-chance");
    var pos = document.querySelector("#update-position");
    pos.innerHTML = "";

    player = getPlayerFromName(player);
    name.value = player.Name;
    col1.value = player.Color1;
    col2.value = player.Color2;
    col3.value = player.Color3;
    tl.value = player.TopLeft;
    tr.value = player.TopRight - player.TopLeft;
    br.value = player.BottomRight - player.TopRight;
    bl.value = player.BottomLeft - player.BottomRight;
    
    var Option = document.createElement("option");
    Option.value = player.Position;
    Option.innerHTML = player.Position;
    pos.appendChild(Option);

    var Option2 = document.createElement("option");
    if(player.Position == "Goalie") {
        Option2.value = "Shooter";
        Option2.innerHTML = "Shooter";
    } else {
        Option2.value = "Goalie";
        Option2.innerHTML = "Goalie";
    }
    pos.appendChild(Option2);
}
function PopulateUpdatePlayerBoth() {
    PopulateUpdatePlayerSelector();
    PopulateUpdatePlayerAttributes();
}

function UpdatePlayer() {
    var selector = document.querySelector("#update-select");
    var player = selector.value;
    player = getPlayerFromName(player);
    console.log("PopulateUpdatePlayerAttributes() player", player);
    
    var name = document.querySelector("#update-name");
    var col1 = document.querySelector("#update-primary-color");
    var col2 = document.querySelector("#update-secondary-color");
    var col3 = document.querySelector("#update-tertiary-color");
    var tl = document.querySelector("#update-tl-chance");
    var tr = document.querySelector("#update-tr-chance");
    var br = document.querySelector("#update-br-chance");
    var bl = document.querySelector("#update-bl-chance");
    var pos = document.querySelector("#update-position");

    
    var TR = (parseInt(tl.value)+parseInt(tr.value)).toString();
    var BR = (parseInt(tl.value)+parseInt(tr.value)+parseInt(br.value)).toString();
    var BL = (parseInt(tl.value)+parseInt(tr.value)+parseInt(br.value)+parseInt(bl.value)).toString();
    
    var data = "Name=" + encodeURIComponent(player.Name) + "&" +
    "Color1=" + encodeURIComponent(col1.value) + "&" +
    "Color2=" + encodeURIComponent(col2.value) + "&" +
    "Color3=" + encodeURIComponent(col3.value) + "&" +
    "TopLeft=" + encodeURIComponent(tl.value) + "&" +
    "TopRight=" + encodeURIComponent(TR) + "&" +
    "BottomRight=" + encodeURIComponent(BR) + "&" +
    "BottomLeft=" + encodeURIComponent(BL) + "&" +
    "Position=" + encodeURIComponent(pos.value) + "&" +
    "NewName=" + encodeURIComponent(name.value);

    var id = player.id;
    
    fetch("http://localhost:8080/players/" + id, {
        // request details
        method: "PUT",
        body: data,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
     }).then(function (response) {
        // when the server responds

        if (response.status == 200) {
            loadPlayersFromServer();
        } else {
            console.log("server responded with", response.status, "when trying to update a player");
        }
    });
}

function DeletePlayer() {
    var selector = document.querySelector("#update-select");
    var player = selector.value;
    player = getPlayerFromName(player);
    data = "id=" + encodeURIComponent(player.id);

    id = player.id;

    fetch("http://localhost:8080/players/" + id, {
        // request details
        method: "DELETE",
        body: data,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
     }).then(function (response) {
        // when the server responds

        if (response.status == 200) {
            loadPlayersFromServer();
        } else {
            console.log("server responded with", response.status, "when trying to update a player");
        }
    });
}

function getPlayerFromName(name) {
    var player;
    for( goalie of Data["Goalies"] ) {
        if(goalie.Name == name){
            player = goalie;
        }
    }
    for( shooter of Data["Shooters"] ) {
        if(shooter.Name == name){
            player = shooter;
        }
    }
    return player;
}


function ChangeColors() {
    console.log("changeColors");
    var position = document.querySelector("#position-selector");
    var posVal = position.value;

    var You = document.querySelector("#your-selector");
    var YValue = You.value;
    var Opp = document.querySelector("#opponent-selector");
    var OValue = Opp.value;
    var y1, y2, y3, o1, o2, o3;

    var gbod1 = document.querySelector("#goalie-body");
    var gbod2 = document.querySelector("#goalie-body2");
    var gbod3 = document.querySelector("#goalie-body3");
    var ghead = document.querySelector("#goalie-head");
    var sbod1 = document.querySelector("#shooter-body");
    var sbod2 = document.querySelector("#shooter-body2");
    var sbod3 = document.querySelector("#shooter-body3");
    var shead = document.querySelector("#shooter-head");
    
    if (posVal == "goalie") {
        Data["Shooters"].forEach(element => {
            if (element["Name"] == OValue) {
                o1 = element["Color1"];
                o2 = element["Color2"];
                o3 = element["Color3"];
            }
        })
        Data["Goalies"].forEach(element => {
            //console.log("names:", element["Name"], element["Color1"], OValue);
            if (element["Name"] == YValue) {
                y1 = element["Color1"];
                y2 = element["Color2"];
                y3 = element["Color3"];
            }
        })
        gbod1.style.backgroundColor = y1;
        gbod2.style.backgroundColor = y2;
        gbod3.style.backgroundColor = y3;
        ghead.style.backgroundColor = y1;
        sbod1.style.backgroundColor = o1;
        sbod2.style.backgroundColor = o2;
        sbod3.style.backgroundColor = o3;
        shead.style.backgroundColor = o1;
    } else if (posVal == "shooter") {
        console.log("posval is shooter");
        Data["Shooters"].forEach(element => {
            if (element["Name"] == YValue) {
                y1 = element["Color1"];
                y2 = element["Color2"];
                y3 = element["Color3"];
            }
        })
        Data["Goalies"].forEach(element => {
            console.log("names:", element["Name"], OValue);
            if (element["Name"] == OValue) {
                o1 = element["Color1"];
                o2 = element["Color2"];
                o3 = element["Color3"];
            }
        })
        gbod1.style.backgroundColor = o1;
        gbod2.style.backgroundColor = o2;
        gbod3.style.backgroundColor = o3;
        ghead.style.backgroundColor = o1;
        sbod1.style.backgroundColor = y1;
        sbod2.style.backgroundColor = y2;
        sbod3.style.backgroundColor = y3;
        shead.style.backgroundColor = y1;
    }
}


function getRandomShooter() {
    var Shooters = Data["Shooters"];
    console.log("Shooters:", Shooters);
    var randomIndex = Math.floor(Math.random() * Shooters.length);
    var randomShooter = Shooters[randomIndex];
    return randomShooter;
}
function getRandomGoalie() {
    var Goalies = Data["Goalies"];
    console.log("Goalies:", Goalies);
    var randomIndex = Math.floor(Math.random() * Goalies.length);
    var randomGoalies = Goalies[randomIndex];
    return randomGoalies;
}




function ShowHideStats() {
    //var Position = document.querySelector("#position-selector").value;
    console.log("ShowHideStats() ran");
    var TopLeft = document.querySelector("#stats-top-left");
    var TopRight = document.querySelector("#stats-top-right");
    var BottomRight = document.querySelector("#stats-bottom-right");
    var BottomLeft = document.querySelector("#stats-bottom-left");

    TopLeft.innerHTML = "";
    TopRight.innerHTML = "";
    /*BottomRight.innerHTML = "";
    BottomLeft.innerHTML = "";*/
    
    console.log("StatSelector.value:", ShowStatsSelector.value);
    if (ShowStatsSelector.value == "hide") {
        TopLeft.innerHTML = "";
        TopRight.innerHTML = "";
        //BottomRight.innerHTML = "";
        //BottomLeft.innerHTML = "";
        return;
    }
    var Position = PositionSelector.value;
    console.log("showStats() Position:", Position);
    var Players = document.querySelector("#opponent-selector");
    console.log("Players:", Players);
    var Player = Players.value;
    console.log("Players.value:", Player);
    console.log("showStats() Player:", Player);
    if (Player == null | Position == null) {
        console.log("showStats() failure");
        return;
    }
    if (Position == "goalie") 
        var PositionArray = Data["Shooters"];
    else if (Position == "shooter")
        var PositionArray = Data["Goalies"];
    console.log("PositionArray:", PositionArray);
    console.log("Player:", Player);
    PositionArray.forEach(element => {
        if (element["Name"] == Player) {
            var El = document.createElement("label");
            El.innerHTML="Top Left %";
            TopLeft.appendChild(El);
            console.log("TopLeft:", TopLeft);
            El = document.createElement("h4");
            El.innerHTML=element["TopLeft"].toString();
            El.style.margin = "0";
            TopLeft.appendChild(El);

            El = document.createElement("label");
            El.innerHTML="Top Right %";
            TopRight.appendChild(El);
            El = document.createElement("h4");
            El.innerHTML=(element["TopRight"] - element["TopLeft"]).toString();
            El.style.margin = "0";
            TopRight.appendChild(El);

            El = document.createElement("label")
            El.innerHTML="Bottom Right %";
            TopRight.appendChild(El);
            El = document.createElement("h4");
            El.innerHTML=(element["BottomRight"] - element["TopRight"]).toString();
            El.style.margin = "0";
            TopRight.appendChild(El);

            El = document.createElement("label");
            El.innerHTML="Bottom Left %";
            TopLeft.appendChild(El);
            El = document.createElement("h4")
            El.innerHTML=(element["BottomLeft"] - element["BottomRight"]).toString();
            El.style.margin = "0";
            TopLeft.appendChild(El);
        }
    })
}


function MoveShooter(i) {
    var Shooter = document.querySelector("#shooter");
    if (i == 0) {
        Shooter.style.gridColumn = "1/2";
        Shooter.classList.remove("shooter-animation");
        console.log("reset shooter");
    }
    else {
        Shooter.style.gridColumn = "4/5";
        Shooter.className = "shooter-animation";
    }
}
function MoveBall(corner) {
    var ball = document.querySelector("#ball");
    var goal = document.querySelector("#inner-goalframe");
    
    goal.appendChild(ball);
    if (corner == 1) {
        ball.style.gridColumn = "1/2";
        ball.style.gridRow = "1/2";
    } else if (corner == 2) {
        ball.style.gridColumn = "5/6";
        ball.style.gridRow = "1/2";
    } else if (corner == 3) {
        ball.style.gridColumn = "5/6";
        ball.style.gridRow = "3/4";
    } else if (corner == 4) {
        ball.style.gridColumn = "1/2";
        ball.style.gridRow = "3/4";
    } else if (corner == 5) {
        var bline = document.querySelector("#ball-line");
        bline.appendChild(ball);
        ball.style.gridColumn = "4/5";
        ball.style.gridRow = "3/4";
    } else if (corner == 0) {
        var bline = document.querySelector("#ball-line");
        bline.appendChild(ball);
        ball.style.gridColumn = "2/3";
        ball.style.gridRow = "3/4";
    }
}
function MoveGoalie(corner) {
    var Head = document.querySelector("#goalie-head");
    var Body = document.querySelector("#goalie-body");
    if (corner == 1) {
        Head.classList.add("goalie-head-tl");
        Body.classList.add("goalie-body-tl");
        /*Head.style.gridColumn = "1/2";
        Head.style.gridRow = "1/2";
        Body.style.gridColumn = "2/3";
        Body.style.gridRow = "1/2";*/
    } else if (corner == 2) {
        Head.classList.add("goalie-head-tr");
        Body.classList.add("goalie-body-tr");
        /*Head.style.gridColumn = "5/6";
        Head.style.gridRow = "1/2";
        Body.style.gridColumn = "4/5";
        Body.style.gridRow = "1/2";*/
    } else if (corner == 3) {
        Head.classList.add("goalie-head-br");
        Body.classList.add("goalie-body-br");
        /*Head.style.gridColumn = "5/6";
        Head.style.gridRow = "3/4";
        Body.style.gridColumn = "4/5";
        Body.style.gridRow = "3/4";*/
    } else if (corner == 4) {
        Head.classList.add("goalie-head-bl");
        Body.classList.add("goalie-body-bl");
        /*Head.style.gridColumn = "1/2";
        Head.style.gridRow = "3/4";
        Body.style.gridColumn = "2/3";
        Body.style.gridRow = "3/4";*/
    } else if (corner == 0) {
        console.log("reset goalie");
        Head.style.gridColumn = "3/4";
        Head.style.gridRow = "2/3";
        Body.style.gridColumn = "3/4";
        Body.style.gridRow = "3/4";
        Head.classList.forEach(element => {
            Head.classList.remove(element);
        })
        Body.classList.forEach(element => {
            Body.classList.remove(element);
        })
    }
}
function CreateTargets() {
    Reset();
    var You = document.querySelector("#your-selector");
    if (!You.value) {
        console.log("No players yet");
        return 0;
    }
    var el = document.querySelector("#top-left-radio");
    if (el) {
        console.log("Cant make more than one set of targets");
        return 0;
    }
    MoveBall(5);
    var goal = document.querySelector("#inner-goalframe");

    el = document.createElement("input");
    el.type = "radio";
    el.id = "top-left-radio";
    el.name = "targets";
    el.style.gridColumn = "1/2";
    el.style.gridRow = "1/2";
    goal.appendChild(el);

    el = document.createElement("input");
    el.type = "radio";
    el.id = "top-right-radio";
    el.name = "targets";
    el.style.gridColumn = "5/6";
    el.style.gridRow = "1/2";
    goal.appendChild(el);

    el = document.createElement("input");
    el.type = "radio";
    el.id = "bottom-right-radio";
    el.name = "targets";
    el.style.gridColumn = "5/6";
    el.style.gridRow = "3/4";
    goal.appendChild(el);

    el = document.createElement("input");
    el.type = "radio";
    el.id = "bottom-left-radio";
    el.name = "targets";
    el.style.gridColumn = "1/2";
    el.style.gridRow = "3/4";
    goal.appendChild(el);
}
function RemoveTargets() {
    var el = document.querySelector("#top-left-radio");
    el.parentNode.removeChild(el);
    el = document.querySelector("#top-right-radio");
    el.parentNode.removeChild(el);
    el = document.querySelector("#bottom-right-radio");
    el.parentNode.removeChild(el);
    el = document.querySelector("#bottom-left-radio");
    el.parentNode.removeChild(el);
}
function GetChosenTarget() {
    var el = document.querySelector("#top-left-radio");
    if (!el) return false;
    if (el.checked) return 1;
    el = document.querySelector("#top-right-radio");
    if (el.checked) return 2;
    el = document.querySelector("#bottom-right-radio");
    if (el.checked) return 3;
    el = document.querySelector("#bottom-left-radio");
    if (el.checked) return 4;
}
function GetRandomCorner() {
    var position = document.querySelector("#position-selector");
    var posVal = position.value;

    var You = document.querySelector("#your-selector");
    var YValue = You.value;
    var Opp = document.querySelector("#opponent-selector");
    var OValue = Opp.value;
    var TL, TR, BR, BL;
    
    if (posVal == "goalie") {
        Data["Shooters"].forEach(element => {
            if (element["Name"] == OValue) {
                TL = element["TopLeft"];
                TR = element["TopRight"];
                BR = element["BottomRight"];
                BL = element["BottomLeft"];
            }
        })
    } else if (posVal == "shooter") {
        Data["Goalies"].forEach(element => {
            console.log("names:", element["Name"], OValue);
            if (element["Name"] == OValue) {
                TL = element["TopLeft"];
                TR = element["TopRight"];
                BR = element["BottomRight"];
                BL = element["BottomLeft"];
            }
        })
    }
    var num = Math.floor(Math.random() * 100);
    console.log("getrandomcorner() num", num, TL, TR, BR, BL);
    if (num < TL) return 1;
    if (num < TR) return 2;
    if (num < BR) return 3;
    if (num < BL) return 4;
    return 0;
}
function Reset() {
    MoveBall(0);
    MoveGoalie(0);
    MoveShooter(0);
    ChangeColors();
    if (document.querySelector("#top-left-radio")) RemoveTargets();
    var res = document.querySelector("#result");
    if (res) {
        var par = res.parentNode.removeChild(res);
    }
}

function Whistle() {
    var You = document.querySelector("#your-selector");
    if (You.value == null) {
        console.log("Whistle() failed");
        return 0;
    }
    if (!GetChosenTarget()) return 0;
    var pickerCorner = GetChosenTarget();
    RemoveTargets();
    var randomCorner = GetRandomCorner();

    var PlayerType = document.querySelector("#position-selector");
    console.log("PlayerType in Whistle():", PlayerType);
    var Position = PlayerType.value;
    console.log("Position in Whistle():", Position);
    MoveShooter();
    console.log("RandomCorner in Whistle():", randomCorner);
    if (Position == "goalie") {
        window.setTimeout(MoveBall, 3500, randomCorner);
        MoveGoalie(pickerCorner);
    } else if (Position == "shooter") {
        window.setTimeout(MoveBall, 3500, pickerCorner);
        MoveGoalie(randomCorner);
    }
    window.setTimeout(ShowResult, 3600, randomCorner, pickerCorner);
}

function ShowResult(corner1, corner2) {
    var result = document.createElement("h1");
    if (corner1 == corner2) {
        result.innerHTML = "SAVE!";
    } else if (corner1 != corner2) {
        result.innerHTML = "GOAL!";
    }
    result.style.gridColumn = "3/4";
    result.style.gridRow = "2/3";
    result.style.margin = "auto";
    result.id = "result";
    document.querySelector("#inner-goalframe").appendChild(result);
}

function ShowAddPlayers() {
    console.log("ShowAddPlayers() called");
    var temp = document.querySelector("#add-player-menu");
    var style = getComputedStyle(temp);
    displayed = style.display;
    if (displayed =="none") {
        temp.style.display = "grid";
    } else {
        temp.style.display = "none";
    }
}
function ShowUpdatePlayers() {
    console.log("ShowUpdatePlayers() called");
    var temp = document.querySelector("#update-player-menu");
    var style = getComputedStyle(temp);
    displayed = style.display;
    if (displayed =="none") {
        temp.style.display = "grid";
    } else {
        temp.style.display = "none";
    }
}

function AddPlayer() {
    position = document.querySelector("#add-position-select").value;
    newName = document.querySelector("#add-name").value;
    pColor = document.querySelector("#add-primary-color").value;
    sColor = document.querySelector("#add-secondary-color").value;
    tColor = document.querySelector("#add-tertiary-color").value;
    tlChance = parseInt(document.querySelector("#add-tl-chance").value);
    trChance = tlChance + parseInt(document.querySelector("#add-tr-chance").value);
    brChance = trChance + parseInt(document.querySelector("#add-br-chance").value);
    blChance = brChance + parseInt(document.querySelector("#add-bl-chance").value);
    console.log("AddPlayer things: ",position,newName,pColor,sColor,tColor,tlChance,trChance,brChance,blChance);
    var PlayerObject = {"Name":newName, "Color1": pColor, "Color2": sColor, "Color3": tColor,
    "TopLeft": tlChance, "TopRight": trChance, "BottomRight": brChance, "BottomLeft": blChance, "Position": position};
    //console.log("player object: ", PlayerObject);
    CreatePlayerOnServer(PlayerObject);
}

function CreatePlayerOnServer(playerObject) {
    //console.log("attempting to create player", playerObject.Name, "on server");
    /* the old way I did it
    playerObject = JSON.stringify(playerObject);
    console.log("playerObject: ", playerObject);
    var data = playerObject;
    */
    var data = "Name=" + encodeURIComponent(playerObject.Name) + "&" +
    "Color1=" + encodeURIComponent(playerObject.Color1) + "&" +
    "Color2=" + encodeURIComponent(playerObject.Color2) + "&" +
    "Color3=" + encodeURIComponent(playerObject.Color3) + "&" +
    "TopLeft=" + encodeURIComponent(playerObject.TopLeft) + "&" +
    "TopRight=" + encodeURIComponent(playerObject.TopRight) + "&" +
    "BottomRight=" + encodeURIComponent(playerObject.BottomRight) + "&" +
    "BottomLeft=" + encodeURIComponent(playerObject.BottomLeft) + "&" +
    "Position=" + encodeURIComponent(playerObject.Position);

    //console.log("sending data to server:", data);
    //var data = encodeURI(playerObject);
    //console.log("sending data to server:", data);
    
    fetch("http://localhost:8080/players", {
        // request details
        method: "POST",
        body: data,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
     }).then(function (response) {
        // when the server responds

        if (response.status == 201) {
            loadPlayersFromServer();
        } else {
            console.log("server responded with", response.status, "when trying to create a player");
        }
    });
}

function loadPlayersFromServer() {
    fetch("http://localhost:8080/players").then(function(response) {
        response.json().then(function(data) {
            console.log("data received form server:", data);
            var g = [];
            var s = [];
            for(player of data) {
                if(player.Position == "Shooter") {
                    s.push(player);
                } else if (player.Position == "Goalie") {
                    g.push(player);
                }
            }

            Data = {"Goalies" : g, "Shooters" : s};  //data.record is also valid. Dictionary vs object syntax
            console.log("Data: ", Data);
            UpdatePlayerOptions();
            Reset();
        });
    });
}

function ResetPlayerRoster() {
    console.log("resetPlayerRoster()");
    playersObject = [
            {
            "Name": "Lev Yashin",
            "Color1": "red",
            "Color2": "yellow",
            "Color3": "red",
            "TopLeft": 40,
            "TopRight": 60,
            "BottomRight": 80,
            "BottomLeft": 100,
            "Position" : "Goalie"
            },
            {
            "Name": "Iker Casillas",
            "Color1": "red",
            "Color2": "yellow",
            "Color3": "white",
            "TopLeft": 20,
            "TopRight": 60,
            "BottomRight": 80,
            "BottomLeft": 100,
            "Position" : "Goalie"
            },
            {
            "Name": "Gianluigi Buffon",
            "Color1": "green",
            "Color2": "white",
            "Color3": "red",
            "TopLeft": 20,
            "TopRight": 40,
            "BottomRight": 80,
            "BottomLeft": 100,
            "Position" : "Goalie"
            },
            {
            "Name": "Tim Howard",
            "Color1": "red",
            "Color2": "white",
            "Color3": "blue",
            "TopLeft": 20,
            "TopRight": 40,
            "BottomRight": 60,
            "BottomLeft": 100,
            "Position" : "Goalie"
            },
            {
            "Name": "Lionel Messi",
            "Color1": "yellow",
            "Color2": "lightskyblue",
            "Color3": "white",
            "TopLeft": 40,
            "TopRight": 60,
            "BottomRight": 80,
            "BottomLeft": 100,
            "Position" : "Shooter"
            },
            {
            "Name": "Cristiano Ronaldo",
            "Color1": "red",
            "Color2": "green",
            "Color3": "yellow",
            "TopLeft": 20,
            "TopRight": 60,
            "BottomRight": 80,
            "BottomLeft": 100,
            "Position" : "Shooter"
            },
            {
            "Name": "Pele",
            "Color1": "green",
            "Color2": "yellow",
            "Color3": "blue",
            "TopLeft": 20,
            "TopRight": 40,
            "BottomRight": 80,
            "BottomLeft": 100,
            "Position" : "Shooter"
            },
            {
            "Name": "Christian Pulisic",
            "Color1": "red",
            "Color2": "white",
            "Color3": "blue",
            "TopLeft": 20,
            "TopRight": 40,
            "BottomRight": 60,
            "BottomLeft": 100,
            "Position" : "Shooter"
            }
        ]
    players = JSON.stringify(playersObject);
    
    //var data = encodeURI(playerObject);
    //console.log("sending data to server:", data);
    
    fetch("http://localhost:8080/players_reset", {
        // request details
        method: "POST",
        body: players,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
     }).then(function (response) {
        // when the server responds

        if (response.status == 201) {
            loadPlayersFromServer();
        } else {
            console.log("server responded with", response.status, "when trying to create a player");
        }
    });
}

function AddEventListeners() {
    var resetButton = document.querySelector("#reset-button");
    resetButton.addEventListener("click", Reset);
    PositionSelector.addEventListener("change", UpdatePlayerOptions)
    var ResetRosterButton = document.querySelector("#reset-roster-button")
    ResetRosterButton.addEventListener("click", ResetPlayerRoster)
    ShowStatsSelector.addEventListener('change', ShowHideStats);
    var ConfirmAddPlayerButton = document.querySelector("#add-player-confirm");
    ConfirmAddPlayerButton.addEventListener("click", AddPlayer);
    ConfirmAddPlayerButton.addEventListener("click", UpdatePlayerOptions);
    var ShowAddPlayersButton = document.querySelector("#show-add-players");
    ShowAddPlayersButton.addEventListener("click", ShowAddPlayers);
    var ShowUpdatePlayersButton = document.querySelector("#show-update-players");
    ShowUpdatePlayersButton.addEventListener("click", ShowUpdatePlayers);
    var ShowUpdateSelect = document.querySelector("#update-select");
    ShowUpdateSelect.addEventListener("change", PopulateUpdatePlayerAttributes);
    var UpdatePlayerConfirm = document.querySelector("#update-player-confirm");
    UpdatePlayerConfirm.addEventListener("click", UpdatePlayer);
    var DeletePlayerButton = document.querySelector("#delete-player-button");
    DeletePlayerButton.addEventListener("click", DeletePlayer);
    var ChooseCornerButton = document.querySelector("#generate-button");
    ChooseCornerButton.addEventListener("click", CreateTargets);
    var WhistleButton = document.querySelector("#whistle");
    WhistleButton.addEventListener("click", Whistle);

    PositionSelector.addEventListener("change", ChangeColors);
    var YourSelector = document.querySelector("#your-selector");
    var OppSelector = document.querySelector("#opponent-selector");
    YourSelector.addEventListener("change", ChangeColors);
    OppSelector.addEventListener("change", ChangeColors);
}


/*fetch("https://api.jsonbin.io/v3/b/63d220f5ace6f33a22c8289f").then(function(response) {
    response.json().then(function(data) {
        console.log("data received form server:", data);
        Data = data["record"];//data.record is also valid. Dictionary vs object syntax
    });
});*/


function main() {
    AddEventListeners();
    loadPlayersFromServer();
}

main();