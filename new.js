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
var bearContent = document.getElementById("bearContent");
document.getElementById("mainButton").onclick = function() {
	console.log("mainButton: Clicked");
	bearContent.style.opacity = 0;
	wait(bearContent.style.display = "none", 400);
	delta_devContent.style.opacity = 0;
	wait(delta_devContent.style.display = "none", 400);
	mainContent.style.opacity = 1;
	wait(mainContent.style.display = "block", 400);
}
document.getElementById("delta_devButton").onclick = function() {
	console.log("delta_dev_Button: Clicked");
	mainContent.style.opacity = 0;
	wait(mainContent.style.display = "none", 400);
	bearContent.style.opacity = 0;
	wait(bearContent.style.display = "none", 400);
	delta_devContent.style.opacity = 1;
	wait(delta_devContent.style.display = "block", 400);
}
document.getElementById("bearButton").onclick = function() {
	console.log("bearButton: Clicked");
	mainContent.style.opacity = 0;
	wait(mainContent.style.display = "none", 400);
	delta_devContent.style.opacity = 0;
	wait(delta_devContent.style.display = "none", 400);
	bearContent.style.opacity = 1;
	wait(bearContent.style.display = "block", 400);
}