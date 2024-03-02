function Resize() {
    document.querySelector("body").style.height = window.innerHeight + "px";
    document.querySelector("body").style.width = window.innerWidth + "px";
}
window.addEventListener("resize", Resize);
window.addEventListener("load", Resize)