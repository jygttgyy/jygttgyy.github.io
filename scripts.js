//Main functions:
function openSection(event, Name) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    };
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    };
    document.getElementById(Name).style.display = "block";
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
//Event listener:
document.addEventListener("keydown", (event) => {
    if (event.isComposing || event.keyCode === 69) {
        var headTag = document.getElementsByTagName('head')[0]
        const linkforCSSfile = document.createElement("link")
        linkforCSSfile.href = '../rainbow.css'
        linkforCSSfile.type = 'text/css'
        linkforCSSfile.rel = 'stylesheet'
        headTag.appendChild(linkforCSSfile);
        document.body.appendChild(headTag);
    } else if (event.isComposing || event.ctrlKey === true) {
        if (event.isComposing || event.keyCode === 66) {
            window.location.replace("../sus")
        }
    }
});