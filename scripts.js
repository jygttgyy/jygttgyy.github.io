function openSection(event, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    };
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    };
    document.getElementById(cityName).style.display = "block";
    event.currentTarget.className += " active";
    };
function openLanguage(language) {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
            var Device = "mobile"
        } else {
            var Device = "main"
        }
    window.location.replace("../" + language + "/" + Device)
}
document.addEventListener("keydown", (event) => {
    if (event.isComposing || event.keyCode === 69) {
      rainbow()
    } else if (event.isComposing || event.ctrlKey === true) {
        if (event.isComposing || event.keyCode === 66) {
            window.location.replace("../sus")
        }
    }
});
function rainbow() {
    var headTag = document.getElementsByTagName('head')[0]
    const linkforCSSfile = document.createElement("link")
    linkforCSSfile.href = '../rainbow.css'
    linkforCSSfile.type = 'text/css'
    linkforCSSfile.rel = 'stylesheet'
    headTag.appendChild(linkforCSSfile);
    document.body.appendChild(headTag);
}