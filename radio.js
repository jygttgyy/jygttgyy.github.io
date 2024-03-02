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
window.addEventListener("resize", Resize);
window.addEventListener("load", function() {Resize(); DetectActive()});