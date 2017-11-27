var audioContext = new AudioContext()
var startTime = audioContext.currentTime +0;
var isPlaying = true;
var pausa = document.getElementById('speaker');
pausa.src = "icons/unmute.svg"
getSample('dms.mp3', function play (buffer) {
  
  var player = audioContext.createBufferSource();
  var gainNode = audioContext.createGain();
  player.buffer = buffer;
  player.connect(gainNode);
  gainNode.connect(audioContext.destination)
  player.loop = true;
  player.start(startTime);
  pausa.addEventListener('click',function(e){
      var startTime = audioContext.currentTime +0;
  
  if(isPlaying){
    gainNode.gain.value = 0;
     isPlaying = false;
     pausa.src = "icons/mute.svg";
  } else if(!isPlaying){
    gainNode.gain.value = 1;
    isPlaying = true;
    pausa.src = "icons/unmute.svg";
  }
  });
})

function getSample (url, cb) {
  var request = new XMLHttpRequest()
  request.open('GET', url)
  request.responseType = 'arraybuffer'
  request.onload = function () {
    audioContext.decodeAudioData(request.response, cb)
  }
  request.send()
}