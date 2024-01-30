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
    fetch("https://d9e1c188-384c-42e5-9a5e-5c096db06ef5-00-1sqcje727ojhp.picard.replit.dev/chat-action").then((response) => {
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
			new_msg.querySelector("#username").innerText = message[0];
			new_msg.querySelector("#content").innerText = message[1];
			new_msg = null;
			current += 1; last_msg += 1;
		}
		target_length = null;
		setTimeout(GetMessages, 1000);
	}).catch((error) => {
		console.log(error);
	});
}
GetMessages();
function SendMessage() {
	if (!cooldown) {
		cooldown = true;
		setTimeout(function() {cooldown = false;}, 500);
        fetch("https://d9e1c188-384c-42e5-9a5e-5c096db06ef5-00-1sqcje727ojhp.picard.replit.dev/chat-action", {
	        method: "POST",
	        body: JSON.stringify({
	        	username: username_input.value,
	        	content: input.value.slice(0, 256),
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
document.addEventListener("keydown", (event) => {
    if (event.code === "Enter" && input.checked) {
        SendMessage();
    }
});