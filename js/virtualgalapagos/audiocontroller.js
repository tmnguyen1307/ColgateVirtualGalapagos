// PAGES SHOULD ALWAYS HAVE BG TRACK ASSIGNED OR AN AUDIO TRACK OF SAME NAME AS PARENT PAGE

var dev_mode = true;
// setting this to true will autoplay audio
var paused = true;
var bg_track;
var player;
var src;
var playpause;

init();

function init(){
  // setup global variables
  player = document.getElementById("player");
  src = document.getElementById("player_src");
  bg_track = src.src;
  
  // grab fallback BG track if none given
  setBGTrack();
  
  //setup audio controls
  setupControls();
  
  // autoplay background audio
  player.oncanplay = function() {
//    playPause();
  };
  
  // setup listener for when audio is done playing
  player.onended = function() {
    trackDone();
  };
  
  // add flag to mastercontroller system
  addFlag("audio");
}


// doesn't work
function initAudioPlayer(){
  player = document.createElement("audio");
  player.id = "player";
  src = document.createElement("source");
  src.id = "player_src";
  src.type = "audio/mpeg";
  player.appendChild(src);
  document.getElementById("audio_control").appendChild(src);
  bg_track = src.src;
}

// if no track assigned, looks for track based on filename
function setBGTrack(){
  if (bg_track = ' '){
    var path = window.location.pathname;
    var page = path.split("/").pop();
    bg_track = page.substr(0, page.length-5);
    setTrack(bg_track);
  }
}

// add audio controls (play/pause,rewind) to page
// depends on page following layout system
function setupControls(){
  var playpause_btn = document.createElement('BUTTON');
  playpause_btn.className = 'btn btn-dark';
  playpause_btn.onclick = function () { 
      playPause();
  };
  var icon = document.createElement("i");
  icon.className = "material-icons";
  icon.innerHTML = "play_arrow";
  playpause_btn.appendChild(icon);
  document.getElementById("audio_control").appendChild(playpause_btn);
  
  var rewind_btn = document.createElement('BUTTON');
  rewind_btn.className = 'btn btn-dark';
  rewind_btn.onclick = function () { 
      rewind(10);
  };
  icon = document.createElement("i");
  icon.className = "material-icons";
  icon.innerHTML = "replay_10";
  rewind_btn.appendChild(icon);
  document.getElementById("audio_control").appendChild(rewind_btn);
  
  if (dev_mode){
    var skip_btn = document.createElement('BUTTON');
    skip_btn.className = 'btn btn-dark';
    skip_btn.onclick = function () { 
        player.currentTime = player.duration-1;
    };
    icon = document.createElement("i");
    icon.className = "material-icons";
    icon.innerHTML = "skip_next";
    skip_btn.appendChild(icon);
    document.getElementById("audio_control").appendChild(skip_btn); 
  }
  
  // set global variables
  playpause = playpause_btn;
}

// toggle play/pause
function playPause(){
  if (paused){
    play();
  } else {
    pause();
  }
}

function play(){
  player.play();
  playpause.getElementsByTagName("i")[0].innerHTML = "pause";
  paused = false;
}

function pause(){
  player.pause();
  playpause.getElementsByTagName("i")[0].innerHTML = "play_arrow";
  paused = true;
}

function rewind(time){
  var curr_time = player.currentTime;
  // avoid underflow
  player.currentTime = Math.max(curr_time - time, 0);
}

// needs to be reworked when more modules are added to not be hardcoded to volcano folder
function setTrack(filename){
  console.log("setting audio track to: " + filename);
  var prefix;
  if (grabPageName().includes("panotour")){
    prefix = "../../audio/volcano/";
  } else {
    prefix = "../audio/volcano/";
  }
  if (src.src != prefix + filename + ".mp3"){
    src.src = prefix + filename + ".mp3";
  }
  player.load();
}

// track finish event listener, clears master controller flag
function trackDone(){
  flagDone("audio");
  playPause();
  rewind(player.duration);
}

function grabPageName(){
  var path = window.location.pathname;
  path = path.split("/").splice(-2);
  if (path[0] != "volcano"){
    return path.join('/');
  } else {
    return path[1];
  }
}