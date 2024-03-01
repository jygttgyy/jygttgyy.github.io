var title = document.getElementById("title");
var text = "jygttgyy        ";
var last = 0;
function UpdateTitle() {
    if (last === text.length) {
        last = 0;
    } else {
        last++
    }
    title.innerText = text.substring(0, last) + text.substring(last);
    setTimeout(UpdateTitle, 500);
}
UpdateTitle();
