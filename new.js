var header = document.getElementById("myHeader");
var sticky = header.offsetTop;

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
	delta_devContent.style.display = "none";
	bearContent.style.display = "none";
	mainContent.style.display = "block";
}
document.getElementById("delta_devButton").onclick = function() {
	console.log("delta_dev_Button: Clicked");
	mainContent.style.display = "none";
	bearContent.style.display = "none";
	delta_devContent.style.display = "block";
}
document.getElementById("bearButton").onclick = function() {
	console.log("bearButton: Clicked");
	mainContent.style.display = "none";
	delta_devContent.style.display = "none";
	bearContent.style.display = "block";
}