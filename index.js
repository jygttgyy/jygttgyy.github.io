var audio = new Audio("https://jygttgyy.github.io/MadeOfSteel.mp3")
audio.volume = 0.1;
audio.loop = true;
var text = "jygttgyy's Official Webpage ";
var last = 0;
function imageRefresh(img, timeout) {
    setTimeout(function() {
        img.src = img.src + "";
    }, timeout);
}
function UpdateTitle() {
    last += 1;
    if (text.substring(last, last + 1) == " ") {
        UpdateTitle();
        return 0;
    } else {
        setTimeout(UpdateTitle, 500);
    }
    if (last >= text.length) {
        last = 0;
        return 0;
    }
    document.title = text.substring(last) + text.substring(0, last);
}
UpdateTitle();
function Resize() {
    document.querySelector("body").style.height = window.innerHeight + "px";
    document.querySelector("body").style.width = window.innerWidth + "px";
}
window.addEventListener("resize", Resize);
Resize();
function DetectActive() {
    if (navigator.userActivation.hasBeenActive) {
        audio.play();
        document.getElementById("shadow").classList.add("welcome");
    } else {
        window.requestAnimationFrame(DetectActive);
    }
}
DetectActive();