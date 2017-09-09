var globalVar = new Object();

function initSettings()
{
  // Assigns different page element to a global Object for easy names
  globalVar.repeatAnim = document.getElementById("repeatCheckbox");
  globalVar.character = document.getElementsByTagName("h1")[0].innerHTML;
  globalVar.attack = document.getElementsByTagName("h2")[0].innerHTML;
  document.getElementsByTagName("h1")[0].innerHTML = characterObject[globalVar.character].name;
  document.getElementsByTagName("h2")[0].innerHTML = characterObject[globalVar.character].move[globalVar.attack].name
  globalVar.maxFrame = characterObject[globalVar.character].move[globalVar.attack].totalFrames;
  document.getElementById("maxFrameSpan").innerHTML = "/" + globalVar.maxFrame;
  globalVar.hitboxRadio = document.getElementById("hitboxRadio");
  globalVar.overlayRadio = document.getElementById("overlayRadio");
  globalVar.selectSpeed = document.getElementById("selectSpeed");
  globalVar.videoPlayer = document.getElementById("videoPlayer");
  globalVar.manualFrameText = document.getElementById("manualFrameText");
  
  // Sets the default form values
  globalVar.fps = 30
  globalVar.selectSpeed.value = "30";
  globalVar.overlayRadio.checked = true;
  globalVar.repeatAnim.checked = true;
  globalVar.videoPlayer.loop = true;
  
  
  // Adds functions (play, pause, ratechange) when a certain event is happening
  globalVar.videoPlayer.addEventListener("play", function() {
    globalVar.frameTimer = setInterval(function(){
      globalVar.manualFrameText.value = Math.floor(globalVar.videoPlayer.currentTime * globalVar.fps + 1);
    }, 60);
  }, false);
  globalVar.videoPlayer.addEventListener("pause", function() {
    //console.log(Math.floor(globalVar.videoPlayer.currentTime * globalVar.fps + 1));
    clearInterval(globalVar.frameTimer);
    // If at the end of the video, the frame count is 1 over the maximum frame number
    globalVar.manualFrameText.value = 
      (Math.floor(globalVar.videoPlayer.currentTime * globalVar.fps + 1) <= globalVar.maxFrame
      ? Math.floor(globalVar.videoPlayer.currentTime * globalVar.fps + 1)
      : globalVar.maxFrame)
  }, false);
  globalVar.videoPlayer.addEventListener("timeupdate", function() {
    //console.log(globalVar.videoPlayer.currentTime);
  }, false);
  globalVar.videoPlayer.addEventListener('loadedmetadata', function () {
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
  
  // Uses function changeSpeed, otherwise only the element "selectSpeed" is changed
  changeSpeed(globalVar.selectSpeed);
  changeSourceVid();
  initKeydown();
}

// Changes the video src url depending on the globalVar.overlayRadio.checked value
function changeSourceVid()
{
  var currentSpeed = globalVar.videoPlayer.playbackRate;
  if (globalVar.overlayRadio.checked)
  {
    globalVar.videoPlayer.src = "o.mp4";
  }
  else if (globalVar.hitboxRadio.checked)
  {
    globalVar.videoPlayer.src = "b.mp4";
  }
  // Sets the frame count to 1 everytime the video src url changes
  globalVar.manualFrameText.value = 1;
  globalVar.videoPlayer.playbackRate = currentSpeed;
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
  globalVar.videoPlayer.pause()
}

// Goes to the first frame
function goToFirstFrame()
{
  changeFrame(1);
}

// This function is called to go to the previous frame.
function goToPreviousFrame()
{
  // Formula so that when placed at first frame, returns last frame
  var nextFrame = ((globalVar.manualFrameText.value - 2 + globalVar.maxFrame) % globalVar.maxFrame + 1)
  // If at first frame and loop is 'false'
  if (globalVar.manualFrameText.value == 1 && !globalVar.videoPlayer.loop)
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
    globalVar.manualFrameText.value = Math.floor(globalVar.videoPlayer.currentTime * 30 + 1);
  }
}

// This function is called to go to the next frame.
function goToNextFrame()
{
  // Formula so that when placed at last frame, returns first frame
  var nextFrame = (globalVar.manualFrameText.value % globalVar.maxFrame + 1)
  if (globalVar.manualFrameText.value == globalVar.maxFrame && !globalVar.videoPlayer.loop)
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
  var currentFrame = globalVar.manualFrameText.value
  globalVar.videoPlayer.previousFrame = currentFrame
  changeSourceVid();
}

// This function is called when 'repeat' is checked or unchecked
function changeRepeat(repeatSelected)
{
  globalVar.videoPlayer.loop = repeatSelected.checked;
}


window.onload = initSettings;