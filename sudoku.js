var puz = [];           // puzzle data - [0]solution [1]game [2]dificulty [3]pname  
var gip = [];           // game in progress
var sol = [];           // solution
var rows = [];          // collection of rows used to check duplicates      
var cols = [];          // collection of columns used to check duplicates
var grps = [];          // collection of groups used to check duplicates
var sfCount = 0;
$(document).ready(function(){
    $(this).bind("contextmenu", function(e) {e.preventDefault(); toggleOptionsMenu();});  // prevents the default context menu (i.e. right click popup for browser) and substitutes my optionsMenu
    processInputData();
    createGroups();
    appendHtmlItems();
    Drawer.init();
});
function toggleOptionsMenu(){
    //
    document.getElementById("optionsMenu").style.display = document.getElementById("optionsMenu").style.display == "block" ? "none" : "block";}
function processInputData(){
   var d1 = mydata.split("|");
   for (var i in d1){
        var d2 = d1[i].split("~");
        puz[i] = {solution: d2[0], game: d2[1], difficulty: d2[2], pname: d2[3]};
    }}
function createGroups(){
    for(var i = 1; i<=9; i++){
        for (var j = 1; j <= 9; j++){
            rows[((i-1)*9)+j] = String(((i-1)*9)+j);
            cols[((i-1)*9)+j] = String(((j-1)*9)+i); 
        }
    }
    for(var i = 1; i<=3; i++){
        for (var j = 1; j <= 3; j++){
            for (var k = 1; k <= 3; k++){
                for (var l = 1; l <= 3; l++){
                    grps[((i-1)*27)+((j-1)*9)+((k-1)*3)+l] = String(((i-1)*27)+((j-1)*3)+((k-1)*9)+l);
                }
            }
        }
    };}
function appendHtmlItems(){
    var ns = "-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;";
    $("html").append('<title>Sudoku</title>');
    $("html").append('<body></body>');
    $("body").append('<div id="background" style="'+ns+'width:1050;height:760;position:absolute;top:0;left:0;background-color:AliceBlue;"></div>');
    $("body").append('<button type="button" id="startButton" style="'+ns+'position:absolute;top:40px;left:40px;width:95px;height:26px;font-family:arial;font-size:14;" onclick="startButtonClick();">Start</button>');
    $("body").append('<div id="timer" style="'+ns+'position:absolute;top:40px;left:130px;width:100px;height:26px;font-family:arial;font-size:14;text-align:right;line-height:26px;">00:00</div>');
    $("body").append('<div id="gameName" style="'+ns+'position:absolute;top:74px;left:40px;width:80px;height:18px;border:1px solid;font-family:arial;font-size:14;text-align:center;line-height:18px;" ></div>');
    $("body").append('<select id = "difficultySelector" onchange = "changeDifficulty(selectedIndex)" style="'+ns+'position:absolute;top:74px;left:130px;width:100px;height:20px;font-family:arial;font-size:14;text-align:left;line-height:18px;display:block;"></select>');
    $("#difficultySelector").append('<option value="0">Easy</option>\
        <option value="1">Moderate</option>\
        <option value="2" selected="true">Hard</option>\
        <option value="3">Extreme</option>');
    $("body").append('<div id="gameStatus" style="'+ns+'position:absolute;top:100px;left:40px;width:210px;height:18px;font-family:arial;font-size:14;text-align:left;line-height:18px;color:Blue;">Waiting for Start</div>');
    $("body").append('<div id="squaresFilled" style="'+ns+'position:absolute;top:125px;left:40px;width:210px;height:18px;font-family:arial;font-size:14;text-align:left;line-height:18px;">Squares Filled -- 0</div>');
    $("body").append('<div id="rotationAndMix" style="'+ns+'position:absolute;top:150px;left:40px;width:250px;height:18px;font-family:arial;font-size:12;text-align:left;line-height:18px;display:none;"></div>');
    for(var i = 1; i<=9; i++){
        $("body").append('<div id="num'+i+'" style="'+ns+'width:40;height:40;position:absolute;top:'+(195+(Math.floor((i-1)/3))*70)+';left:'+(45+((i+2)%3)*70)+';font-family:arial;font-size:38;color:Grey;" ondragstart="DragDrop.drag(event);"ondrop="DragDrop.drop(event);" ondragover="DragDrop.allowDrop(event);" >'+i+'</div>' );
        $("body").append('<div id="rem'+i+'" class="crem" style="'+ns+'width:17;height:14;position:absolute;top:'+(195+(Math.floor((i-1)/3))*70)+';left:'+(28+((i+2)%3)*70)+';font-family:arial;font-size:12;" >9</div>');
    }
    $("body").append('<canvas id="can" width="630" height="630" style="'+ns+'position:absolute;top:40;left:300;border:1px solid;" ondblclick="Drawer.togglePen();" ondrop="DragDrop.drop(event);" ondragover="DragDrop.allowDrop(event);"></canvas>');
    for(var i = 1; i<=8; i++){
        $("body").append('<div style="'+ns+'width:0;height:'+(i%3 == 0  ? 629 : 630)+';position:absolute;top:40;left:'+(300+i*70)+';border:'+(i%3 == 0  ? 1.5 : .5)+'px solid;" ></div>' );   // vertical lines
        $("body").append('<div style="'+ns+'width:'+(i%3 == 0  ? 629 : 630)+';height:0;position:absolute;top:'+(40+i*70)+';left:300;border:'+(i%3 == 0  ? 1.5 : .5)+'px solid;" ></div>' );   // horizontal lines
    }
    $("body").append('<div id="optionsMenu" style="'+ns+'width:210;height:280;position:absolute;top:390;left:30;background-color:White;border:1px solid;display:none;z-index:10000;font-family:Consolas;font-size:14;"></div>');
    $("#optionsMenu").append('<button type="button" id="newGameButton" onclick="newGameButtonClick();"style="width:120;height:22;position:absolute;top:5;left:45;font-family:Consolas;font-size:14;">New Game</button><br>\
                <button type="button" id="selectGameButton" onclick="selectGameButtonClick();"style="width:120;height:22;position:absolute;top:32;left:45;font-family:Consolas;font-size:14;">Select Game</button><br>\
                <form  style="position:absolute;top:60;left:0;">\
                    <input type="checkbox" id="cbTimer" checked onchange="timer.style.display = cbTimer.checked ? \'block\' : \'none\';">Show Timer</input><br>\
                    <input type="checkbox" id="cbGameName" checked onchange="gameName.style.display = cbGameName.checked ? \'block\' : \'none\';">Show Game Name</input><br>\
                    <input type="checkbox" id="cbDifficulty" checked onchange="difficultySelector.style.display = cbDifficulty.checked ? \'block\' : \'none\';">Show Difficulty</input><br>\
                    <input type="checkbox" id="cbSquaresFilled" checked onchange="squaresFilled.style.display = cbSquaresFilled.checked ? \'block\' : \'none\';">Show Squares Filled</input><br>\
                    <input type="checkbox" id="cbRotationMix"  onchange="rotationAndMix.style.display = cbRotationMix.checked ? \'block\' : \'none\';">Show Rotation  Mix</input><br>\
                    <input type="checkbox" id="cbCountRemaining" checked onchange="var a = cbCountRemaining.checked ? \'block\' : \'none\';rem1.style.display = a; rem2.style.display=a;rem3.style.display=a;rem4.style.display=a;rem5.style.display=a;rem6.style.display=a;rem7.style.display=a;rem8.style.display=a;rem9.style.display=a;">Show Count Remaining</input><br>\
                    <input type="checkbox" id="cbDuplicates" checked onchange="showDuplicates(cbDuplicates.checked);"">Show Duplicates</input><br>\
                    <input type="checkbox" id="cbErrors" checked onchange="showErrors(cbErrors.checked);">Show Errors</input><br>\
                    <input type="checkbox" id="cbEraseSquare" checked>Erase Square When Filled</input><br>\
                </form>\
                <button type="button" id="okButton" onclick="toggleOptionsMenu();"style="width:120;height:22;position:absolute;top:250;left:45;font-family:Arial;font-size:12;">OK</button><br>');
    $("body").append('<div id="selectGamePopup" style="'+ns+'position:absolute;top:215px;left:475px;width:280px;height:280px;font-family:arial;font-size:14;text-align:left;line-height:18px;background-color:rgb(255,200,200);border:1px solid;display:none;z-index:1000">Select Game</div"');
    $("#selectGamePopup").append('<div style="'+ns+'position:absolute;top:25px;left:30px;width:100px;height:18px;font-family:arial;font-size:14;text-align:center;line-height:18px;" >Difficulty</div>');
    $("#selectGamePopup").append('<div style="'+ns+'position:absolute;top:25px;left:150px;width:100px;height:18px;font-family:arial;font-size:14;text-align:center;line-height:18px;" >Game</div>');
    $("#selectGamePopup").append('<select id = "puDifficultySelector" onchange = "changeDifficulty(selectedIndex)" style="'+ns+'position:absolute;top:45px;left:30px;width:100px;height:20px;font-family:arial;font-size:14;text-align:left;line-height:18px;display:block;"></select>');
    $("#puDifficultySelector").append('<option value="0">Easy</option>\
        <option value="1">Moderate</option>\
        <option value="2" selected="true">Hard</option>\
        <option value="3">Extreme</option>');
    $("#selectGamePopup").append('<select id = "puGameList" style="'+ns+'position:absolute;top:45px;left:150px;width:100px;height:20px;font-family:arial;font-size:14;text-align:left;line-height:18px;"></select>');
    $("#selectGamePopup").append('<button type="button" id="puOkButton" onclick="newGame(puGameList.value); selectGamePopup.style.display=\'none\';"style="width:80;height:26px;position:absolute;top:240;left:40;font-family:Arial;font-size:14;">OK</button><br>');
    $("#selectGamePopup").append('<button type="button" id="puCancelButton" onclick="selectGamePopup.style.display=\'none\';"style="width:80;height:26px;position:absolute;top:240;left:160;font-family:Arial;font-size:14;">Cancel</button><br>');
}
function changeDifficulty(val){
    document.getElementById("difficultySelector").selectedIndex = val;
    document.getElementById("puDifficultySelector").selectedIndex = val;
    if(document.getElementById("selectGamePopup").style.display == "block"){
        loadPopupGameList();
    }}
function showErrors(erCkd){
    if(document.getElementById("gameStatus").innerHTML=="Game paused"){return;}
    if(erCkd){
        for (var i = 1; i <= 81; i++){
            if(gip[i]!="0" && gip[i] != sol[i]){document.getElementById("a"+i).style.color = "red"; document.getElementById("a"+i).style.textDecoration = "line-through";}
        }
    }
    else {
        for (var i = 1; i <= 81; i++){
            if(gip[i]!="0" && document.getElementById("a"+i).classList.contains("move") ){document.getElementById("a"+i).style.color = "blue"; document.getElementById("a"+i).style.textDecoration = "none";}
        }
        showDuplicates(document.getElementById("cbDuplicates").checked);
    }}
function showDuplicates(duCkd){
    var ind;
    if(document.getElementById("gameStatus").innerHTML=="Game paused"){return;}
    for (var i = 1; i <= 81; i++){
     //   if(gip[i] != "0" && document.getElementById("a"+i).classList.contains("move") && document.getElementById("a"+i).style.color != "red"){document.getElementById("a"+i).style.color = "blue";}
        if(duCkd){
            ind = rows.indexOf(String(i));
            for(var j = (Math.floor((ind-1)/9)*9)+1; j <= (Math.floor((ind-1)/9)*9)+9; j++){
                if (gip[i] == gip[rows[j]] && rows[j] != i && gip[i] !== "0"){
                    if(document.getElementById("a"+i).style.color == "blue"){document.getElementById("a"+i).style.color = "darkorange";}
                    if(document.getElementById("a"+rows[j]).style.color == "blue"){document.getElementById("a"+rows[j]).style.color = "darkorange";}
                }
            }
            ind = cols.indexOf(String(i));
            for(var j = (Math.floor((ind-1)/9)*9)+1; j <= (Math.floor((ind-1)/9)*9)+9; j++){
                if (gip[i] == gip[cols[j]] && cols[j] != i && gip[i] !== "0"){
                    if(document.getElementById("a"+i).style.color == "blue"){document.getElementById("a"+i).style.color = "darkorange";}
                    if(document.getElementById("a"+cols[j]).style.color == "blue"){document.getElementById("a"+cols[j]).style.color = "darkorange";}
                }
            }
            ind = grps.indexOf(String(i));
            for(var j = (Math.floor((ind-1)/9)*9)+1; j <= (Math.floor((ind-1)/9)*9)+9; j++){
                if (gip[i] == gip[grps[j]] && grps[j] != i && gip[i] !== "0"){
                    if(document.getElementById("a"+i).style.color == "blue"){document.getElementById("a"+i).style.color = "darkorange";}
                    if(document.getElementById("a"+grps[j]).style.color == "blue"){document.getElementById("a"+grps[j]).style.color = "darkorange";}
                }
            }
        }
        else{
            if(gip[i]!="0" && document.getElementById("a"+i).style.color == "darkorange"){document.getElementById("a"+i).style.color = "blue";}
        }
    }}
function startButtonClick(){
    switch(document.getElementById("startButton").innerHTML){
        case "Start":
        case "New Game":
            newGame(-1);
        break
        case "Pause":
            document.getElementById("startButton").innerHTML="Resume";
            Timer.pause();
            document.getElementById("gameStatus").innerHTML="Game paused";  document.getElementById("gameStatus").style.color = "Blue";
            for (var i = 1; i <= 9; i++){
                document.getElementById("num"+i).style.color = "Grey";
                document.getElementById("num"+i).draggable = false;
            }
            for (var i = 1; i <= 81; i++){
                var a = document.getElementById("a"+i);
                if (a !== null){
                    a.style.color = "Grey";
                    a.draggable = false;
                }
            }
        break
        case "Resume":
            document.getElementById("startButton").innerHTML="Pause";
            Timer.resume();
            document.getElementById("gameStatus").innerHTML="Game in progress";  document.getElementById("gameStatus").style.color = "Green"; 
            for (var i = 1; i <= 9; i++){
                document.getElementById("num"+i).style.color = "Black";
                document.getElementById("num"+i).draggable = true;
            } 
            for (var i = 1; i <= 81; i++){
                var bb = document.getElementById("a"+i);
                if (bb !== null){
                    if (bb.classList.contains("move")) {bb.style.color = "Blue"; bb.draggable = true;}
                    else {bb.style.color = "Black";}
                }
            }
            showErrors(document.getElementById("cbErrors").checked);
        break
    }}
function newGameButtonClick(){
    switch(document.getElementById("startButton").innerHTML){
        case "Start":
        case "New Game":
            newGame(-1);
        break
        case "Pause":
            if(confirm("Are you sure that you want to end the game in progress and start a new game?")){
                Timer.pause();
                newGame(-1);
            }
        break
        case "Resume":
            if(confirm("Are you sure that you want to end the game in progress and start a new game?")){
                newGame(-1);
            }
        break
    }}
function selectGameButtonClick(){
    if(document.getElementById("startButton").innerHTML == "Start" || document.getElementById("startButton").innerHTML == "New Game" || confirm("Are you sure that you want to end the game in progress and start a new game?")){
        if(document.getElementById("gameStatus").innerHTML == "Game in progress"){   startButtonClick();}
        loadPopupGameList();
        document.getElementById("selectGamePopup").style.display = "block";
    }}
function loadPopupGameList(){
        $('#puGameList').children().remove()
        var p = [];
        var j = 0;
        var opt;
        for(var i in puz){
            if (puz[i].difficulty == document.getElementById("difficultySelector").value){
                p[j]= [puz[i].pname,i];
                j++;
            } 
        }
        p.sort();
        for (var i = 0; i <= p.length-1; i++){
            opt = document.createElement("option");
            opt.text = p[i][0];
            opt.value = p[i][1];    
            document.getElementById("puGameList").add(opt);
        }}
function newGame(gameNumber){
    var ns = "-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;";
    for (var i = 1; i <= 81; i++){
        var bb = document.getElementById("a"+i);
        if (bb !== null){bb.parentNode.removeChild(bb);}
    }
    for (var i = 1; i <= 9; i++){
        document.getElementById("num"+i).style.color = "Black";
        document.getElementById("num"+i).draggable = true;
        document.getElementById("rem"+i).innerHTML = "9";
    }
    Drawer.ctx.clearRect(0,0,630,630);
    sfCount = 0;

            var gameToPlay = setUpGame(gameNumber);
            for (var i = 1; i <= 81; i++){
                sol[i] = gameToPlay.solution.substr(i-1,1);
                if(gameToPlay.game.substr(i-1,1)!="0"){
                    $("body").append('<div id="a'+i+'" class="perm" style="'+ns+'width:40;height:40;position:absolute;top:'+(55+(Math.floor((i-1)/9)*70))+';left:'+(245+((((i-1)%9)+1)*70))+';font-family:arial;font-size:38;color:Black;text-align:center;vertical-align:middle;">'+(gameToPlay.game.substr(i-1,1))+'</div>');
                    gip[i] = gameToPlay.game.substr(i-1,1);
                    sfCount++;
                    document.getElementById("rem"+gameToPlay.game.substr(i-1,1)).innerHTML = String(Number(document.getElementById("rem"+gameToPlay.game.substr(i-1,1)).innerHTML)-1);
                }
                else{
                    gip[i] = "0";
                }
            }
            document.getElementById("startButton").innerHTML="Pause";
            document.getElementById("gameName").innerHTML=puz[gameToPlay.gameNumber].pname;
            document.getElementById("gameStatus").innerHTML="Game in progress";  document.getElementById("gameStatus").style.color = "Green"; 
            document.getElementById("squaresFilled").innerHTML="Squares Filled --  "+sfCount;
            document.getElementById("rotationAndMix").innerHTML="Rotation - "+ gameToPlay.rotation +"   Number Mix - "+ gameToPlay.numMix;
            Timer.start(0,0);  }
function setUpGame(gameNumber){
        var gnum = gameNumber== -1 ? getGameNumber() : gameNumber;
        var grot = getGameRotation();
        var numMix = getNumberMix();
        var thisGame = puz[gnum].game;
        var thisSoln = puz[gnum].solution;
        var tempGame = "";
        var tempSoln = "";
        var mystring = getPermutations(grot.substr(0,1),"col||row",0);
        mystring = mystring + getPermutations(grot.substr(1,1),"col||row",3);
        mystring = mystring + getPermutations(grot.substr(2,1),"col||row",6);
        for(var i = 0; i<=8; i++){
            for(var j = 0; j<=8; j++){
                tempGame = tempGame + String(thisGame.substr((i*9)+Number(mystring.substr(j,1)),1));
                tempSoln = tempSoln + String(thisSoln.substr((i*9)+Number(mystring.substr(j,1)),1));
            }
        }
        thisGame = tempGame; thisSoln = tempSoln; tempGame = ""; tempSoln = "";
        mystring = getPermutations(grot.substr(3,1),"col||row",0);
        mystring = mystring + getPermutations(grot.substr(4,1),"col||row",3);
        mystring = mystring + getPermutations(grot.substr(5,1),"col||row",6);
        for(var i = 0; i<=8; i++){
            for(var j = 0; j<=8; j++){
                tempGame = tempGame + String(thisGame.substr(i+(Number(mystring.substr(j,1))*9),1));
                tempSoln = tempSoln + String(thisSoln.substr(i+(Number(mystring.substr(j,1))*9),1));
            }
        }
        thisGame = tempGame; thisSoln = tempSoln; tempGame = ""; tempSoln = "";
        mystring = getPermutations(grot.substr(6,1),"block",0);
        for(var i = 0; i<=8; i++){
            for(var j = 0; j<=8; j++){
                tempGame = tempGame + String(thisGame.substr((i*9)+Number(mystring.substr(j,1)),1));
                tempSoln = tempSoln + String(thisSoln.substr((i*9)+Number(mystring.substr(j,1)),1));
            }
        }
        thisGame = tempGame; thisSoln = tempSoln; tempGame = ""; tempSoln = "";
        mystring = getPermutations(grot.substr(7,1),"block",0);
        for(var i = 0; i<=8; i++){
            for(var j = 0; j<=8; j++){
                tempGame = tempGame + String(thisGame.substr(i+(Number(mystring.substr(j,1))*9),1));
                tempSoln = tempSoln + String(thisSoln.substr(i+(Number(mystring.substr(j,1))*9),1));
            }
        }
        thisGame = tempGame; thisSoln = tempSoln; tempGame = ""; tempSoln = "";
        for(var i = 0; i<=80; i++){
            tempGame = tempGame + String(thisGame.substr(i,1) == "0" ? "0" : numMix.substr(Number(thisGame.substr(i,1))-1,1));
            tempSoln = tempSoln + String(numMix.substr(Number(thisSoln.substr(i,1))-1,1));
        }
        thisGame = tempGame; thisSoln = tempSoln; tempGame = ""; tempSoln = "";
        var gameToPlay = {gameNumber:gnum,game:thisGame,solution:thisSoln,rotation:grot,numMix:numMix};
        return gameToPlay;
    function getGameNumber(){
        var p = [];
        var j = 0;
        for(var i in puz){
            if (puz[i].difficulty == difficultySelector.value){
                p[j] = i;
                j++;
            } 
        }
        return p[Math.floor((Math.random() * p.length))];}
    function getGameRotation(){
        var rotationString = "";
        for (var i=1; i<=8; i++){rotationString = rotationString + String(Math.floor((Math.random() * 6)+1));}
        return rotationString;}
    function getNumberMix(){
        var u1 = 0;
        var numbersString ="";
        var mystring = "123456789";
        for (var i = 9; i >= 1; i--){
            u1 =  Math.floor((Math.random() * i));
            numbersString = numbersString + mystring.substr( u1, 1);
            mystring =  mystring.substring(0, u1 ) + mystring.substring( u1 + 1);
        }
        return numbersString;}
    function getPermutations(seed,type,factor){
        var s = "";
        switch(type){
            case "col||row": 
                switch(seed){
                    case "1": s = "012"; break
                    case "2": s = "021"; break
                    case "3": s = "102"; break
                    case "4": s = "120"; break
                    case "5": s = "201"; break
                    case "6": s = "210"; break
                }
                s = (String(Number(s.substr(0,1)) + factor)) + (String(Number(s.substr(1,1)) + factor)) + (String(Number(s.substr(2,1)) + factor));              
            break
            case "block":
                switch(seed){
                    case "1": s = "012345678"; break
                    case "2": s = "012678345"; break
                    case "3": s = "345012678"; break
                    case "4": s = "345678012"; break
                    case "5": s = "678012345"; break
                    case "6": s = "678345012"; break
                }
            break
        }
        return s;}  }
var Timer = {           // Timer Functions
    start: function(m,s){
        document.getElementById("timer").innerHTML =  ("00" + m).slice(-Math.max(2,String(m).length)) + ":" + ("00" + s).slice(-2);
        if (s == 59) { m = m + 1; s = -1; }
        s = s + 1;
        id = setTimeout(function () {Timer.start(m, s)}, 1000);
    },
    pause: function() {clearTimeout(id);
    },
    resume: function() {
        var t = document.getElementById("timer").innerHTML.split(":");
        Timer.start(parseInt(t[0], 10), parseInt(t[1], 10));
    }}
var Drawer = {          // Drawing functions
    canvas: false,
    ctx:  false,
    flag: false,
    dot_flag: false,
    prevX: 0,
    currX: 0,
    prevY: 0,
    currY: 0, 
    ss: "black",
    lw: 1,
    init: function() {
        Drawer.canvas = document.getElementById('can');
        Drawer.ctx = Drawer.canvas.getContext("2d");
        Drawer.canvas.addEventListener("mousemove", function (e) {
        Drawer.findxy('move', e)
        }, false);
        Drawer.canvas.addEventListener("mousedown", function (e) {
            Drawer.findxy('down', e)
        }, false);
        Drawer.canvas.addEventListener("mouseup", function (e) {
            Drawer.findxy('up', e)
        }, false);
        Drawer.canvas.addEventListener("mouseout", function (e) {
            Drawer.findxy('out', e)
        }, false);
    },
    findxy: function(res, e) {
        if (res == 'down') {
            Drawer.prevX = Drawer.currX;
            Drawer.prevY = Drawer.currY;
            Drawer.currX = e.clientX - Drawer.canvas.offsetLeft;
            Drawer.currY = e.clientY - Drawer.canvas.offsetTop;
            Drawer.flag = true;
            Drawer.dot_flag = true;
            if (Drawer.dot_flag) {
                Drawer.ctx.beginPath();
                Drawer.ctx.fillStyle = x;
                Drawer.ctx.fillRect(Drawer.currX, Drawer.currY, 2, 2);
                Drawer.ctx.closePath();
                Drawer.dot_flag = false;
            }
        }
        if (res == 'up' || res == "out") {
            Drawer.flag = false;
        }
        if (res == 'move') {
            if (Drawer.flag) {
                Drawer.prevX = Drawer.currX;
                Drawer.prevY = Drawer.currY;
                Drawer.currX = e.clientX - Drawer.canvas.offsetLeft;
                Drawer.currY = e.clientY - Drawer.canvas.offsetTop;
                Drawer.draw();
            }
        }
    },
    draw:  function() {
        if(document.getElementById("gameStatus").innerHTML=="Game in progress"){
            Drawer.ctx.beginPath();
            Drawer.ctx.moveTo(Drawer.prevX, Drawer.prevY);
            Drawer.ctx.lineTo(Drawer.currX, Drawer.currY);
            Drawer.ctx.strokeStyle = Drawer.ss;
            Drawer.ctx.lineWidth = Drawer.lw;
            Drawer.ctx.stroke();
            Drawer.ctx.closePath();
        }
    },
    togglePen: function(){
        if(Drawer.ss=="black"){
            Drawer.ss ="AliceBlue";
            Drawer.lw = 14;
            Drawer.canvas.style.cursor="crosshair";
        }
        else {
           Drawer.ss = "black";
           Drawer.lw = 1;
           Drawer.canvas.style.cursor="default";
        }
    }}
var DragDrop = {        // Drag and Drop functions
    allowDrop: function(ev) {ev.preventDefault();},
    drag: function(ev)  {ev.dataTransfer.setData("text", ev.target.id);},
    drop: function(ev)  {ev.preventDefault();
        var ns = "-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;";
        if(ev.target.id == "can"){
            var i = (Math.floor((ev.x - 300)/70)+1)+(Math.floor((ev.y - 40)/70)*9);
            if (gip[i]=="0"){
               $("body").append('<div id="a'+i+'" class="move" style="'+ns+'width:40;height:40;position:absolute;top:'+(55+(Math.floor((i-1)/9)*70))+';left:'+(245+((((i-1)%9)+1)*70))+';font-family:arial;font-size:38;color:Blue;text-align:center;vertical-align:middle;" ondragstart="DragDrop.drag(event);" draggable="true"  >'+document.getElementById(ev.dataTransfer.getData("text")).innerHTML+'</div>');
               gip[i] = document.getElementById(ev.dataTransfer.getData("text")).innerHTML
               sfCount++;
               document.getElementById("rem"+document.getElementById(ev.dataTransfer.getData("text")).innerHTML).innerHTML = String(Number(document.getElementById("rem"+document.getElementById(ev.dataTransfer.getData("text")).innerHTML).innerHTML)-1);
 
                removeMovedItem();
                if (document.getElementById("cbEraseSquare").checked) {Drawer.ctx.clearRect(((i-1)%9)*70,Math.floor((i-1)/9)*70,70,70);}
                if(document.getElementById("cbErrors").checked){
                    if(gip[i]!== sol[i]){ document.getElementById("a"+i).style.color = "Red"; document.getElementById("a"+i).style.textDecoration = "line-through";}
                }
                showDuplicates(document.getElementById("cbDuplicates").checked);
            }
            var gameOver = true;
            for(var j = 1; j <= 81; j++){
                if (gip[j] != sol[j]){ gameOver = false; break;}
            } 
            if (gameOver){
                Timer.pause();
                document.getElementById("gameStatus").innerHTML = "Congratulations !!! - Game solved";
                document.getElementById("gameStatus").style.color = "red";
                document.getElementById("startButton").innerHTML="New Game";
                for (var j = 1; j <= 9; j++){
                    document.getElementById("num"+j).style.color = "Grey";
                    document.getElementById("num"+j).draggable = false;
                }
                for (var j = 1; j <= 81; j++){
                    var a = document.getElementById("a"+j);
                    if (a !== null){a.draggable = false;}
                }
            }
        }
        else{
            removeMovedItem();
            showDuplicates();
        }
        document.getElementById("squaresFilled").innerHTML="Squares Filled --  " + sfCount;

        function removeMovedItem(){
            if(ev.dataTransfer.getData("text").substr(0,1)=="a"){
               document.getElementById("rem"+document.getElementById(ev.dataTransfer.getData("text")).innerHTML).innerHTML = String(Number(document.getElementById("rem"+document.getElementById(ev.dataTransfer.getData("text")).innerHTML).innerHTML)+1);

                document.getElementById(ev.dataTransfer.getData("text")).parentNode.removeChild(document.getElementById(ev.dataTransfer.getData("text")));
                gip[Number(ev.dataTransfer.getData("text").substr(1))] = "0";
                sfCount--;
            }
        }
    }}
