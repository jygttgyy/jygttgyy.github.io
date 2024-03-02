var audio = new Audio("https://jygttgyy.github.io/MadeOfSteel.mp3")
audio.volume = 0.1;
audio.loop = true;
var text = "jygttgyy's Official Webpage ";
var last = 0;
function imageRefresh(img, timeout) {
    setTimeout(function() {
        if (img.id == "img0") {
            document.getElementById("img1").style.visibility = "visible";
        } else if (img.id == "img1") {
            document.getElementById("img0").style.visibility = "visible";
        }
        document.getElementById(img.id).style.visibility = "hidden";
        document.getElementById(img.id).src = "";
        document.getElementById(img.id).src = "https://lanyard.cnrad.dev/api/701017644010176515";
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
        document.getElementById("D").classList.add("appear");
    } else {
        window.requestAnimationFrame(DetectActive);
    }
}
DetectActive();