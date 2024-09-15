var text = "jygttgyy's Official Webpage ";
var last = 0;
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
window.addEventListener("load", UpdateTitle);
