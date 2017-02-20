/**
 * @framedisplay.js 
 * Provides functions to control the animation.
 *
 * Author: MCG (2014-2017)
 * Individual animation frames were captured by: Sangoku, Madao, mixa and MCG
 */

globalVar = new Object();

function initSettings()
{
  // Assigns different page element to a global Object for easy names
  globalVar.repeatAnim = document.getElementById("repeatCheckbox");
  globalVar.character = document.getElementById("selectChar");
  globalVar.attack = document.getElementById("selectAtt");
  globalVar.hitboxRadio = document.getElementById("hitboxRadio");
  globalVar.overlayRadio = document.getElementById("overlayRadio");
  globalVar.selectSpeed = document.getElementById("selectSpeed");
  globalVar.videoPlayer = document.getElementById("videoPlayer");
	globalVar.videoSource = document.getElementById("videoSource");
  globalVar.manualFrameText = document.getElementById("manualFrameText");
  
  // Sets the default form values
  globalVar.fps = 30;
  globalVar.selectSpeed.value = "30";
  globalVar.overlayRadio.checked = true;
  globalVar.repeatAnim.checked = true;
  globalVar.videoPlayer.loop = true;
  
  
  // Adds functions (play, pause, ratechange) when a certain event is happening
  globalVar.videoPlayer.addEventListener("play", function() {
		//console.log("in play");
    globalVar.frameTimer = setInterval(function(){
      globalVar.manualFrameText.value = getCurrentFrame();
    }, 60);
  }, false);
  globalVar.videoPlayer.addEventListener("pause", function() {
		//console.log("in pause");
    clearInterval(globalVar.frameTimer);
    globalVar.manualFrameText.value = getCurrentFrame();
  }, false);
	/*
  globalVar.videoPlayer.addEventListener("timeupdate", function() {
    console.log(globalVar.videoPlayer.currentTime);
  }, false);
	*/
  globalVar.videoPlayer.addEventListener('loadedmetadata', function () {
		//console.log("in loadedmetadata");
    if (this.previousFrame)
    {
      changeFrame(this.previousFrame);
      delete this.previousFrame;
    }
  }, false);
  globalVar.videoPlayer.addEventListener("ratechange", function() {
    chosenFPS = globalVar.videoPlayer.playbackRate * globalVar.fps;
    if ([15, 20, 30].indexOf(chosenFPS) >= 0)
    {
      globalVar.selectSpeed.value = globalVar.videoPlayer.playbackRate * globalVar.fps;
    }
    else
    {
      alert("Invalid FPS");
      globalVar.selectSpeed.value = 30;
      globalVar.videoPlayer.playbackRate = 1;
    }
    //
  }, false);
  
  changeChar();
  // Uses function changeSpeed, otherwise only the element "selectSpeed" is changed
  changeSpeed(globalVar.selectSpeed);
  initKeydown();
}

// Creates the source location string and returns it
function getSourceLocation(character, attack, type)
{
	var path = "fd/";
	path += character;
	path += "/";
	path += attack;
	path += "/";
	path += type;
	path += ".mp4";
	return path;
}

// Returns the current frame based on currentTime
function getCurrentFrame()
{
	var currentFrame = (Math.round(globalVar.videoPlayer.currentTime * globalVar.fps + 1) <= globalVar.maxFrame
	 ? Math.round(globalVar.videoPlayer.currentTime * globalVar.fps + 1)
	 : globalVar.maxFrame);
	return currentFrame;
}

// Changes the video src url depending on the globalVar.overlayRadio.checked value
function changeSourceVid()
{
  var currentSpeed = globalVar.videoPlayer.playbackRate;
  if (globalVar.overlayRadio.checked)
  {
    globalVar.videoSource.src = getSourceLocation(globalVar.character.value, globalVar.attack.value, "o");
  }
  else if (globalVar.hitboxRadio.checked)
  {
    globalVar.videoSource.src = getSourceLocation(globalVar.character.value, globalVar.attack.value, "b");
  }
	globalVar.videoPlayer.load();
  // Sets the frame count to 1 everytime the video src url changes
  globalVar.manualFrameText.value = getCurrentFrame();
  globalVar.videoPlayer.playbackRate = currentSpeed;
}

// Changes the 'Character' title and calls the populateAttack function
function changeChar()
{
	clearInterval(globalVar.frameTimer);
  document.getElementsByTagName("h1")[0].innerHTML = "Character: " + characterObject[globalVar.character.value].name;
  populateAttack(globalVar.character.value);
}

// Populates the 'Attack' dropdown list for the specific character
function populateAttack(charSelected)
{
  var optgroupAtt = document.getElementById("selectAtt").firstElementChild;
  // If element "selectAtt" is already filled, removes previous values
  while (optgroupAtt.firstElementChild)
  {
    optgroupAtt.removeChild(optgroupAtt.firstElementChild);
  }
  // Fills the new values for the character
  for (var key in characterObject[charSelected].move) {
    var optionAtt = document.createElement("OPTION");
    optionAtt.text = characterObject[charSelected].move[key].name;
    optionAtt.value = key;
    optgroupAtt.appendChild(optionAtt);
  }
    changeAtt();
}

// This function is called when a new attack is selected from the drop-down list
function changeAtt(attDropdownObject)
{
	clearInterval(globalVar.frameTimer);
  // Changes the name of the 'Attack' title
  document.getElementsByTagName("h2")[0].innerHTML = "Attack: " + characterObject[globalVar.character.value].move[globalVar.attack.value].name;
  // Changes the number of maximum frames for the attack
  globalVar.maxFrame = characterObject[globalVar.character.value].move[globalVar.attack.value].totalFrames;
  document.getElementById("maxFrameSpan").innerHTML = '/' + globalVar.maxFrame;
  
  changeSourceVid();
}

function playFrame()
{
  if (globalVar.videoPlayer.paused)
  {
    globalVar.videoPlayer.play();
  }
  else
  {
    pauseFrame();
  }
}

// Stops the animation
function pauseFrame()
{
  globalVar.videoPlayer.pause();
}

// Goes to the first frame
function goToFirstFrame()
{
  changeFrame(1);
}

// This function is called to go to the previous frame.
function goToPreviousFrame()
{
	var currentFrame = getCurrentFrame();
  // Formula so that when placed at first frame, returns last frame
  var nextFrame = ((currentFrame - 2 + globalVar.maxFrame) % globalVar.maxFrame + 1);

  if (currentFrame == 1 && !globalVar.videoPlayer.loop)
  {
    return;
  }
    changeFrame(nextFrame);
}

// This function is called whenever you want to change currentTime
function changeFrame(newFrame)
{
  globalVar.videoPlayer.currentTime = (newFrame - 1) / globalVar.fps;
  globalVar.manualFrameText.value = newFrame;
}

// This function is called whenever the frame number is changed manually
function changeManualFrame()
{
  var newFrame = parseInt(globalVar.manualFrameText.value, 10);
  if (newFrame <= globalVar.maxFrame && newFrame > 0) { changeFrame(newFrame); }
  else {
    alert("Enter a number between : 1 and " + globalVar.maxFrame);
    globalVar.manualFrameText.value = getCurrentFrame();
  }
}

// This function is called to go to the next frame.
function goToNextFrame()
{
	var currentFrame = getCurrentFrame();
  // Formula so that when placed at last frame, returns first frame
  var nextFrame = (currentFrame % globalVar.maxFrame + 1);
  if (currentFrame == globalVar.maxFrame && !globalVar.videoPlayer.loop)
  {
    return;
  }
    changeFrame(nextFrame);
}

// Goes to the last frame
function goToLastFrame()
{
  changeFrame(globalVar.maxFrame);
}

// This function is called whenever the speed in the drop-down list is changed.
function changeSpeed(speedSelected)
{
  globalVar.videoPlayer.playbackRate = speedSelected.value / globalVar.fps;
}

// This function is called whenever the displayModeRadio is changed.
function changeHitbox()
{
  pauseFrame();
	clearInterval(globalVar.frameTimer);
  var currentFrame = getCurrentFrame();
  globalVar.videoPlayer.previousFrame = currentFrame;
  changeSourceVid();
}

// This function is called when 'repeat' is checked or unchecked
function changeRepeat(repeatSelected)
{
  globalVar.videoPlayer.loop = repeatSelected.checked;
}


window.onload = initSettings;
