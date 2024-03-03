function ParseTime(duration) {
    let hrs = ~~(duration / 3600);
    let mins = ~~((duration % 3600) / 60);
    let secs = ~~duration % 60;
    let ret = "";
    if (hrs > 0) {
      ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }
    ret += "" + mins + ":" + (secs < 10 ? "0" : "") + secs;
    return ret;
}
function Resize() {
    document.body.style.height = window.innerHeight + "px";
    document.body.style.width = window.innerWidth + "px";
}
function DetectActive() {
    if (navigator.userActivation.hasBeenActive) {
        document.getElementById("shadow").addEventListener("animationend", function() {
            document.getElementById("shadow").remove();
        })
        document.getElementById("shadow").classList.add("welcome");
    } else {
        window.requestAnimationFrame(DetectActive);
    }
}
const audio = new Audio("MadeOfSteel.mp3");
audio.addEventListener('loadedmetadata', function() {
    document.getElementById("timeInput").max = audio.duration;
})
function PauseAudio() {
    document.getElementById("playPauseButton").querySelector("img").src = "ButtonImages/Play.png";
    audio.pause();
    document.getElementById("playPauseButton").onclick = PlayAudio;
}
function PlayAudio() {
    document.getElementById("playPauseButton").querySelector("img").src = "ButtonImages/Stop.png";
    audio.volume = parseInt(document.getElementById("volumeInput").value) / 100;
    //audio.currentTime = parseInt(document.getElementById("timeInput").value);
    audio.play();
    document.getElementById("playPauseButton").onclick = PauseAudio;
}
document.getElementById("playPauseButton").onclick = PlayAudio;
document.getElementById("volumeInput").addEventListener('input', function() {
    let volume = document.getElementById("volumeInput").value;
    audio.volume = volume;
    document.getElementById("volumePercent").innerText = volume + "%";
});
document.getElementById("timeInput").addEventListener('input', function() {
    audio.currentTime = document.getElementById("timeInput").value;
    document.getElementById("timePassed").innerText = ParseTime(parseInt(document.getElementById("timeInput").value));
});
audio.addEventListener('timeupdate', function() {
    document.getElementById("timeInput").value = audio.currentTime;
    document.getElementById("timePassed").innerText = ParseTime(parseInt(document.getElementById("timeInput").value));
});
window.addEventListener("resize", Resize);
window.addEventListener("load", DetectActive);
Resize()