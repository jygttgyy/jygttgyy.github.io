var header = document.getElementById("myHeader");
var sticky = header.offsetTop;

function wait(func, ms) {
	setTimeout(func, ms)
}
window.onscroll = function() {
	if (window.pageYOffset > sticky || window.scrollY > sticky) {
		header.classList.add("sticky");
	} else {
		header.classList.remove("sticky");
	}
}
document.getElementById("discordButton").onclick = function() {
	window.open("https://discord.gg/eyT56H4sux", "_blank");
}

var mainContent = document.getElementById("mainContent");
var delta_devContent = document.getElementById("delta_devContent");
var jygttgyyContent = document.getElementById("jygttgyyContent");
document.getElementById("mainButton").onclick = function() {
	console.log("mainButton: Clicked");
	jygttgyyContent.style.opacity = 0;
	wait(jygttgyyContent.style.display = "none", 400);
	delta_devContent.style.opacity = 0;
	wait(delta_devContent.style.display = "none", 400);
	mainContent.style.opacity = 1;
	wait(mainContent.style.display = "block", 400);
}
document.getElementById("delta_devButton").onclick = function() {
	console.log("delta_dev_Button: Clicked");
	mainContent.style.opacity = 0;
	wait(mainContent.style.display = "none", 400);
	jygttgyyContent.style.opacity = 0;
	wait(jygttgyyContent.style.display = "none", 400);
	delta_devContent.style.opacity = 1;
	wait(delta_devContent.style.display = "block", 400);
}
document.getElementById("jygttgyyButton").onclick = function() {
	console.log("jygttgyyButton: Clicked");
	mainContent.style.opacity = 0;
	wait(mainContent.style.display = "none", 400);
	delta_devContent.style.opacity = 0;
	wait(delta_devContent.style.display = "none", 400);
	jygttgyyContent.style.opacity = 1;
	wait(jygttgyyContent.style.display = "block", 400);
}

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
            window.location.replace("../sus/sus.html")
        }
    }
});