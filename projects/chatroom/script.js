var input = document.getElementById("input");
var username_input = document.getElementById("username_input");
var button = document.getElementById("send");
var msg = document.getElementById("message_template").cloneNode();
msg.id = "message";
document.getElementById("message_template").remove();
var container = document.getElementById("container");
var cooldown = false;
var messages = [];
function GetMessages() {
    fetch(window.location.href + "-action").then((response) => {
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
			var new_msg = msg.cloneNode();
			new_msg.id = "msg";
			new_msg.innerText = message[0] + " | " + message[1];
			container.appendChild(new_msg);
			new_msg = null;
			current += 1;
		}
		target_length = null;
		setTimeout(GetMessages, 1000);
	}).catch((error) => {
		console.log(error);
	});
}
GetMessages();
button.onclick = function() {
	if (!cooldown) {
		cooldown = true;
		setTimeout(function() {cooldown = false;}, 500);
        fetch(window.location.href + "-action", {
	        method: "POST",
	        body: JSON.stringify({
	        	username: username_input.value,
	        	content: input.value.slice(0, 256),
	        }),
	        headers: {
	        	"Content-type": "application/json; charset=UTF-8"
	        }
	    }).then((response) => {
		    if (!response.ok) {
		    	throw new Error(`HTTP error: ${response.status}`);
		    }
		    console.log("Success sending message!");
        })
	}
	input.value = "";
}