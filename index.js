document.body.style.height = window.innerHeight + "px";
document.body.style.width = window.innerWidth + "px";
var audio = new Audio("Musics/Made Of Steel.mp3")
audio.volume = 0.1;
audio.loop = true;
var text = "jygttgyy's Official Webpage ";
var last = 0;
const WindowHandler = () => {
    document.querySelectorAll('div[type="window"]').forEach(element => {
        let bar = element.querySelector('div[type="bar"]');
        let x = parseInt(bar.parentElement.style.left.slice(0, -2)), y = parseInt(bar.style.top.slice(0, -2));
        var base_mx, base_my;
        const MouseAction = (event) => {
            bar.parentElement.style.left = x + (event.x - base_mx) + "px";
            bar.parentElement.style.top = y + (event.y - base_my) + "px";
        }
        const Cancel = (event) => {
            bar.onmousemove = null;
        }
        bar.onmousedown = (event) => {
            base_mx = event.x, base_my = event.y;
            bar.onmousemove = MouseAction;
            bar.onmouseup = Cancel;
        }
    });
}
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
        setTimeout(UpdateTitle, 250);
    }
    if (last >= text.length) {
        last = 0;
    }
    document.title = text.substring(last) + text.substring(0, last);
}
UpdateTitle();
function Resize() {
    document.body.style.height = window.innerHeight + "px";
    document.body.style.width = window.innerWidth + "px";
}
function DetectActive() {
    if (navigator.userActivation.hasBeenActive) {
        audio.play();
        document.getElementById("shadow").addEventListener("animationend", function() {
            document.getElementById("shadow").remove();
        })
        document.getElementById("shadow").classList.add("welcome");
    } else {
        window.requestAnimationFrame(DetectActive);
    }
}
window.addEventListener("resize", Resize);
window.addEventListener("load", DetectActive);
