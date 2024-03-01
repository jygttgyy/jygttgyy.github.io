document.querySelector("body").style.height = document.body.scrollHeight + "px";
var audio = new Audio("https://jygttgyy.github.io/MadeOfSteel.mp3")
audio.volume = 0.1;
audio.loop = true;
var text = "jygttgyy's Official Webpage ";
var last = 0;
function UpdateTitle() {
    if (last === text.length) {
        last = 0;
        return 0;
    }
    last += 1;
    if (text.substring(last, last + 1) == " ") {
        UpdateTitle();
        return 0;
    } else {
        setTimeout(UpdateTitle, 500);
    }
    document.title = text.substring(last) + text.substring(0, last);
}
UpdateTitle();
function Resize() {
    document.querySelector("body").style.height = Math.ceil(window.innerHeight / 10) * 10 + "px";
}
window.addEventListener("resize", Resize);
Resize();
function DetectActive() {
    if (navigator.userActivation.hasBeenActive) {
        audio.play();
        document.getElementById("D").classList.add("appear");
    } else {
        window.requestAnimationFrame(DetectActive);
    }
}
DetectActive();