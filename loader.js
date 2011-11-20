// Author: Christopher Burman
// Purpose: Sketchup Plugin for Pachube.com
// Now in git


var feedNumber = 1908;
var minValues = new Array();
var maxValues = new Array();
var yoText;
var newVals;
var currentPos = 0;
var currentTime;
var streamOne = new Array();
var pHistory = new Array();
pHistory[0] = new Array();
pHistory[0][0] = "blank";
var time = new Array();
var tempVals;
var dataFeedNumber;
var dataStreamNumber; 
var curObjNum;
var totObjNum;
var historyLength = 100;
var envCounter = 0;
var historyCounter = 0;
var timeIndex;
var numActiveObjects;
var firstTime;
var firstLoad;
var tempA = new Array();
tempA[0] = 1;
tempA[1] = 2;
var pJ = {};
var jsonCalled = 0;
var envLoaded = false;


function setMsg(locationX,tempstring){
    elem = document.getElementById(locationX);
    elem.innerHTML = tempstring;
}

setMsg('outputText',"Please select a Pachube Environment to Activate");


function leapTime(val){
if (val == 0){
currentPos = historyLength-1;

} else {
currentPos = 0;
}
calcTime();
document.getElementById("curVal").value = currentTime;
setVal();
}


function changeTime(value){
    if ((currentPos + value > 0) && (currentPos + value < historyLength - 1)) {
        currentPos += value;
        calcTime();
        document.getElementById("curVal").value = currentTime;
        setVal();
    } else {
    
       // setMsg('outputText','Date out of Range');
    }
}
function activateEnv() {
	setMsg('outputText',"Loading Pachube Data..");
    timeIndex = -1;
    firstTime = true;
    firstLoad = true;
    historyCounter = 0;
    query = 'skp:activateEnv@' + tempA;
    window.location.href = query;
}
function SU (where, values){
    query = 'skp:'+where+'@' + values;
    window.location.href = query;
}
function loadJSON(url) {
  alert("TEST CALL ONE");
    //alert ("you have loaded Json: " + jsonCalled++);
    var headID = document.getElementsByTagName("head")[0];         
    var newScript = document.createElement('script');
    newScript.type = 'text/javascript';
    newScript.src = url;
    headID.appendChild(newScript);
}    
function calcTime(){
    //quarters = (currentPos % 4) * 15;
    //hours = (currentPos - (currentPos % 4)) / 4;
    currentTime = time[timeIndex][currentPos];
    year = currentTime.charAt(0) + currentTime.charAt(1) + currentTime.charAt(2) + currentTime.charAt(3);
    month = currentTime.charAt(5) + currentTime.charAt(6);
  	day = currentTime.charAt(8) + currentTime.charAt(9);
  	minute = currentTime.charAt(11) + currentTime.charAt(12);
	hour = currentTime.charAt(14) + currentTime.charAt(15);

    //setMsg('outputText',year+month+day+hour+minute);
    currentTime = minute+":"+hour+", " +day+"-"+month+"-"+year;
}
function getJSON(feedID, streamID, NewObjNum, NewTotObjNum){

    showLoader();
    curObjNum = NewObjNum;
    totObjNum = NewTotObjNum;
    dataFeedNumber = feedID;
    dataStreamNumber = streamID;
    if (firstLoad == true){
        for (i = 0; i < totObjNum; i++){
            pHistory[i] = new Array();//("blank");
            pHistory[i][0] = "blank";
            time[i] = new Array();
            time[i][0] = "blank";
        }
        firstLoad = false;
    }
    
     alert("getJsonCalled2");
    //loadJSON('http://www.pachube.com/api/'+ feedID +'.json?callback=getPachubeJSON');
    loadJSON('http://api.pachube.com/feeds/'+ feedID +'.json?callback=getPachubeJSON');
    
    alert('http://api.pachube.com/feeds/'+ feedID +'.json?callback=getPachubeJSON');
}
function getHistory(){
  
    loadJSON("http://apps.pachube.com/history/archive_json.php?f="+dataFeedNumber+"&d="+dataStreamNumber+"&callback=getPachubeHistory");
    
}

// javascript Dump function
// from stackoverflow :http://stackoverflow.com/questions/130404/javascript-data-formatting-pretty-printer

function DumpObject(obj)
{
  var od = new Object;
  var result = "";
  var len = 0;

  for (var property in obj)
  {
    var value = obj[property];
    if (typeof value == 'string')
      value = "'" + value + "'";
    else if (typeof value == 'object')
    {
      if (value instanceof Array)
      {
        value = "[ " + value + " ]";
      }
      else
      {
        var ood = DumpObject(value);
        value = "{ " + ood.dump + " }";
      }
    }
    result += "'" + property + "' : " + value + ", ";
    len++;
  }
  od.dump = result.replace(/, $/, "");
  od.len = len;

  return od;
}


function getPachubeJSON(env){
alert("getPachubeJsonCalled");

    pJ =  eval(env);
       
    if (pJ.title == pJ.title){
        maxMin = new Array();
        
        alert("getPachubeJsonCall 2");
        //BREAKING HERE>
        
        var jsonString = "JSON: ";
        jsonString += pJ;
        
       // var myJSONText = JSON.stringify(myObject, replacer);
	//var myObject = JSON.parse(env);
        //alert(myObject);
        
        alert("testing dump...");
        var testString = DumpObject(pJ);
        alert(testString.dump);
        testString = DumpObject(pJ.datastreams);
         alert(testString.dump);
        
        maxMin[0] =  pJ.datastreams[dataStreamNumber].value.min_value;
       	maxMin[1] =  pJ.datastreams[dataStreamNumber].value.max_value;
        
        alert("getPachubeJsonCall 4");
        SU('maxMin', maxMin);
    } else {
        alert(dataFeedNumber + "is not a valid Pachube Feed");
    }
    alert("getPachubeJsonCall Finished");
}
function getPachubeHistory(env){
    pJ =  eval(env);
    pHistory[curObjNum] = new Array();
    pHistory[curObjNum][0] = "blank";
    time[curObjNum] = new Array();
    time[curObjNum][0] = "blank";
    //history[curObjNum].length = pJ.value.length;
    //time[curObjNum].length = pJ.value.length;
    if ((timeIndex == -1) && (pJ.value.length > 0)){
        timeIndex = curObjNum;
        historyLength = pJ.value.length;
    }
    var i = 0;
    for (i = 0; i < pJ.value.length; i++){
        pHistory[curObjNum][i] = pJ.value[i];
        time[curObjNum][i] = pJ.time[i];
    }
    SU('history',tempA);
}
function isNumeric(elem, helperMsg){
    var numericExpression = /^[0-9]+$/;
    if(elem.match(numericExpression)){
        return true;
    }else{
        alert(helperMsg);
        //elem.focus();
        return false;
    }
}
function setFeedInfo(tempFeedID, tempStreamID){
    tempFeedIDString = tempFeedID.value+'';
    tempStreamIDString = tempStreamID.value+'';
    valueOne = isNumeric(tempFeedIDString, "The Feed ID you have entered is not a valid number");
    if (valueOne){
        valueTwo = isNumeric(tempStreamIDString, "The Stream ID you have entered is not a valid number");
        if (valueOne && valueTwo){
            feedStream = new Array();
            feedStream[0] = tempFeedIDString;
            feedStream[1] = tempStreamIDString;
            SU('setSensor', feedStream);
        }
    }
}
function setStaticObject(){
    feedStream = new Array();
    feedStream[0] = 0;
    feedStream[1] = 0;
    SU('setSensor', feedStream);
}
function setInitialTime(){
    currentPos = historyLength - 1;
    calcTime();
    document.getElementById("curVal").value = currentTime;
    setVal();
}
function setVal() {
 pHistory[0] = new Array();
    var ar = new Array();
    //var i = 0;
    for (ii = 0; ii < totObjNum; ii++){
       
        ar[ii] = "";
    
        if (pHistory[ii]){
            if (pHistory[ii][0]){
                if (pHistory[ii][0] != "blank"){
                    ar[ii] = pHistory[ii][currentPos];
                } else {
                    //alert(ii + "is blank!");
                } 
            } else {
                //alert ("Histrory[ii] doesn't exsist");
            }
        } else {
            //alert("History don't exsist");
        }
    }
    if (firstTime == true) {
        setTimeout("",300);
        firstTime = false;
        currentPos = 0;
        envLoaded = true;
        setMsg("outputText","Pachube Environment Loaded. <br>Values Set to Earliest Pachube Data");
        hideLoader();
    }
    document.getElementById("history").style.display = "block";
    SU('setValues',ar);
}
function createEnv(envLabel){
    envLabel = envLabel.value+'';
    if (envLabel == "Environment Label"){
        envLabel = "Pachube Environment"+envCounter;
        envCounter +=1;
    } 
    SU('createEnv',envLabel);
}
function showLoader(){
    document.getElementById('loader').style.visibility = 'visible'; 
}
function hideLoader(){
    document.getElementById('loader').style.visibility = 'hidden'; 
}
hideLoader();
