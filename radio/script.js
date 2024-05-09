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
window.onresize = Resize;
//window.addEventListener("resize", Resize);
Resize();
window.onload = DetectActive;
//window.addEventListener("load", DetectActive);

// Actual Script

function ParseTime(duration) {
    let hours = ~~(duration / 3600);
    let minutes = ~~((duration % 3600) / 60);
    let seconds = ~~duration % 60;
    let finalString = "";
    if (hours > 0) {
        finalString += "" + hours + ":" + (minutes < 10 ? "0" : "");
    }
    finalString += "" + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    return finalString;
}
const audios = [
    {
        "name": "Made Of Steel",
        "artist": "Battlejuice X LeBrock",
        "picture": "Made Of Steel.jpg",
        "color": "98, 49, 48"
    },
    {
        "name": "Epic Step Music",
        "artist": "AXS Music",
        "picture": "Electronic Step Music.jpg",
        "color": "63, 127, 154"
    },
    {
        "name": "On Fire",
        "artist": "Eminem",
        "picture": "Recovery.jpg",
        "color": "137, 144, 153"
    },
    {
        "name": "Almost Famous",
        "artist": "Eminem",
        "picture": "Recovery.jpg",
        "color": "137, 144, 153"
    },
    {
        "name": "Seduction",
        "artist": "Eminem",
        "picture": "Recovery.jpg",
        "color": "rgb(137, 144, 153)"
    },
    {
        "name": "So Bad",
        "artist": "Eminem",
        "picture": "Recovery.jpg",
        "color": "137, 144, 153"
    },
]
var audio = new Audio();
audio.isPlaying = false;
audio.current = 0;
function PauseAudio() {
    audio.isPlaying = false;
    document.getElementById("playPauseButton").querySelector("img").src = "ButtonImages/Play.png";
    audio.pause();
    document.getElementById("playPauseButton").onclick = PlayAudio;
}
function PlayAudio() {
    if (audio.readyState == 4) {
        audio.isPlaying = true;
        document.getElementById("playPauseButton").querySelector("img").src = "ButtonImages/Stop.png";
        audio.volume = parseInt(document.getElementById("volumeInput").value) / 100;
        audio.play();
        document.getElementById("playPauseButton").onclick = PauseAudio;
    } else {
        window.requestAnimationFrame(PlayAudio);
    }
}
audio.onload = function() {
    if (audio.isPlaying) {
        audio.oncanplay = PlayAudio;
        //document.getElementById("playPauseButton").onclick = PauseAudio;
    } else {
        audio.oncanplay = function() {};
        //document.getElementById("playPauseButton").onclick = PlayAudio;
    }
}
audio.onloadedmetadata = function() {
    document.getElementById("timeInput").value = 0;
    document.getElementById("timePassed").innerText = "0:00";
    document.getElementById("timeInput").max = audio.duration;
}
audio.onended = function() {
    audio.current += 1;
    if (audio.current >= audios.length) audio.current = 0;
    NextAudio();
}
document.getElementById("forwardsButton").onclick = function() {
    audio.current += 1;
    if (audio.current >= audios.length) audio.current = 0;
    NextAudio();
}
document.getElementById("backwardsButton").onclick = function() {
    audio.current -= 1;
    if (audio.current < 0) audio.current = audios.length;
    NextAudio();
}
document.getElementById("timeInput").oninput = function() {
    audio.currentTime = document.getElementById("timeInput").value;
    document.getElementById("timePassed").innerText = ParseTime(parseInt(document.getElementById("timeInput").value));
};
document.getElementById("volumeInput").oninput = function() {
    let volume = document.getElementById("volumeInput").value;
    audio.volume = volume / 100;
    document.getElementById("volumePercent").innerText = volume + "%";
};
audio.ontimeupdate = function() {
    let currentTime = audio.currentTime;
    document.getElementById("timeInput").value = currentTime;
    document.getElementById("timePassed").innerText = ParseTime(currentTime);
}
function NextAudio() {
    var currentAudio = audios[audio.current];
    //audio.onloadedmetadata = OnMetadataLoad;
    //audio.onended = OnEnd;
    //audio.ontimeupdate = OnTimeUpdate;
    audio.src = "Musics/" + currentAudio.name + ".mp3";
    //document.getElementById("backwardsButton").onclick = OnBack;
    //document.getElementById("forwardsButton").onclick = OnSkip;
    document.getElementById("musicControlPanel").style.background = "rgba(" + currentAudio.color + ", 0.2)";
    document.getElementById("musicName").innerText = currentAudio.name;
    document.getElementById("musicArtist").innerText = currentAudio.artist;
    document.getElementById("musicImage").src = "Musics/" + currentAudio.picture;
    audio.load()
}
NextAudio();
