function initKeydown()
{
  document.getElementById("videoPlayer").onkeydown = function(e)
  {
    if (!e) e = window.event;
    var keynum = e.keyCode ? e.keyCode : e.which
    switch (keynum) {
      case 39: case 40: case 70:
	if (!globalVar.videoPlayer.paused)
	{
	  pauseFrame();
	}
	goToNextFrame();
	break;
      case 37: case 38: case 66:
	if (!globalVar.videoPlayer.paused)
	{
	  pauseFrame();
	}
	goToPreviousFrame();
	break;
      case 32: case 80:
	playFrame();
	break;
      case 65:
	if (!globalVar.videoPlayer.paused)
	{
	  pauseFrame();
	}
	goToFirstFrame();
	break;
      case 69:
	if (!globalVar.videoPlayer.paused)
	{
	  pauseFrame();
	}
	goToLastFrame();
	break;
      case 72:
	if (!globalVar.videoPlayer.paused)
	{
	  pauseFrame();
	}
	globalVar.hitboxRadio.checked = true;
	changeHitbox();
	break;
      case 79:
	if (!globalVar.videoPlayer.paused)
	{
	  pauseFrame();
	}
	globalVar.overlayRadio.checked = true;
	changeHitbox();
	break;
      case 82:
	globalVar.repeatAnim.checked = globalVar.repeatAnim.checked ? false : true
	globalVar.videoPlayer.loop = globalVar.repeatAnim.checked;
	break;
    }
    return;
  };
}

