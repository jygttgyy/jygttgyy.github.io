document.querySelector("body").style.height = document.body.scrollHeight + "px";
const audio = new Audio("https://jygttgyy.github.io/MadeOfSteel.mp3")
audio.volume = 0.5;
audio.loop = true;
var text = "jygttgyy's Official Webpage ";
var last = 0;
function UpdateTitle() {
    setTimeout(UpdateTitle, 500);
    if (last === text.length) {
        last = 0;
        return 0;
    }
    last += 1;
    document.title = text.substring(last) + text.substring(0, last);
}
UpdateTitle();
function Resize() {
    document.querySelector("body").style.height = Math.round(window.innerHeight / 10) * 10 + "px";
}
window.addEventListener("resize", Resize);
Resize();
function DetectActive() {
    if (navigator.userActivation.hasBeenActive) {
        audio.play();
        
    } else {
        window.requestAnimationFrame(DetectActive);
    }
}
DetectActive();