var input = document.getElementById("input");
var username_input = document.getElementById("username_input");
var button = document.getElementById("send");
var msg = document.getElementById("msg_template").cloneNode(true);
msg.id = "msg";
document.getElementById("msg_template").remove();
var container = document.getElementById("messages");
var cooldown = false;
var messages = [];
var last_msg = 0;
function GetMessages() {
    fetch("http://us-nyc03.pylex.me:8433/chat-action").then((response) => {
	    if (!response.ok) {
		    throw new Error(`HTTP error: ${response.status}`);
	    }
	    return response.text();
	}).then((json) => {
		j = JSON.parse(json)
		json = null;
		var current = 0 + messages.length;
		while (messages.length < j.length) {
			var message = j[current];
			messages.push(message);
			var new_msg = msg.cloneNode(true);
			new_msg.id = "msg_" + last_msg;
			container.appendChild(new_msg);
			new_msg.querySelector("#username").innerText = "@" + message[0] + " " + message[1];
			new_msg.querySelector("#content").innerText = message[2];
			new_msg = null;
			current += 1; last_msg += 1;
		}
		target_length = null;
		setTimeout(GetMessages, 10);
	}).catch((error) => {
		console.log(error);
	});
}
GetMessages();
function setCookie(cname, cvalue, exdays) {
	const d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	let expires = "expires="+d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
} 
function getCookie(cname) {
	let name = cname + "=";
	let ca = document.cookie.split(';');
	for(let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}
function SendMessage() {
	if (cooldown === false) {
		cooldown = true;
		setTimeout(function() {cooldown = false;}, 500);
		var id = getCookie("id");
		if (id == "") {
			id = "" + Math.round(Math.random() * 9) + Math.round(Math.random() * 9) + Math.round(Math.random() * 9) + Math.round(Math.random() * 9);
			setCookie("id", id, 365);
		}
        fetch("http://us-nyc03.pylex.me:8433/chat-action", {
	        method: "POST",
	        body: JSON.stringify({
				id: id,
	        	username: username_input.value.replace(/\s+/g, '').slice(0, 20),
	        	content: input.value.slice(0, 1024),
	        }),
	        headers: {
	        	"Content-type": "application/json; charset=UTF-8"
	        },
			mode: 'no-cors'
	    })
	}
	input.value = "";
}
input.addEventListener("click", function() {input.value = "";})
button.addEventListener("click", SendMessage)
var height = window.innerHeight;
height -= height * 0.02
height = Math.floor(((height - 115)/39) * 39)
document.getElementById("messages").style.height = height + "px";
height = null;
var ctrlL = false, dollar = false; 
document.addEventListener("keydown", (event) => {
    if (event.code === "Enter" && document.activeElement == input) {
        SendMessage();
    } else if (event.code === "ControlLeft") {
		ctrlL = true;
	} else if (event.code === "BracketRight") {
		dollar = true;
	}
});
document.addEventListener("keyup", (event) => {
    if (event.code === "ControlLeft") {
		ctrlL = false;
	} else if (event.code === "BracketRight") {
		dollar = false;
	}
});