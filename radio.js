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
const audios = [
    {
        "name": "Made Of Steel",
        "artist": "Battlejuice X LeBrock"
    },
    {
        "name": "Epic Step Music",
        "artist": "AXS Music"
    },
]
var current = 0;
function NextAudio() {
    var currentAudio = audios[current];
    var audio = new Audio("Musics/" + currentAudio.name + ".mp3");
    document.getElementById("timeInput").value = 0;
    document.getElementById("timePassed").innerText = "0:00";
    document.getElementById("musicName").innerText = currentAudio.name;
    audio.addEventListener('loadedmetadata', function() {
        document.getElementById("timeInput").max = audio.duration;
    })
    audio.addEventListener('ended', function() {
        current += 1;
        audio = null;
        NextAudio();
    })
    function PauseAudio() {
        document.getElementById("playPauseButton").querySelector("img").src = "ButtonImages/Play.png";
        audio.pause();
        document.getElementById("playPauseButton").onclick = PlayAudio;
    }
    function PlayAudio() {
        document.getElementById("playPauseButton").querySelector("img").src = "ButtonImages/Stop.png";
        audio.volume = parseInt(document.getElementById("volumeInput").value) / 100;
        audio.play();
        document.getElementById("playPauseButton").onclick = PauseAudio;
    }
    document.getElementById("playPauseButton").onclick = PlayAudio;
    document.getElementById("volumeInput").addEventListener('input', function() {
        let volume = document.getElementById("volumeInput").value;
        audio.volume = volume / 100;
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
}
window.addEventListener("resize", Resize);
window.addEventListener("load", DetectActive);
Resize();
NextAudio();