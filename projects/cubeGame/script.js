// Minigame made by jygttgyy!
// Settings Section:

var grid = [
    [1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1],
    [0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0],
    [0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0]
] /* MAP GRID:
Coordinates relative to table position! (ETA: grid[0][0] -> y = 0; x = 0;)
0: Nothing.
1: Wall.
NaN: Invisible wall.
*/
var x = 1, y = 0; // Starting position.
const speed = 2; // Set to higher for less smooth but faster gameplay.
const x_offset = 0; // X coordinates offset.
const y_offset = 0; // Y coordinates offset.
const size = 100; // Must also be changed in the CSS file (style.css)

// Actual Code:
var z = false;
var s = false;
var d = false;
var q = false;
var lastInput = [];
lastInput.z = false;
lastInput.s = false;
lastInput.d = false;
lastInput.q = false;
var old_x =  0 + x, old_y = 0 + y;
const hit = document.getElementById("hitBase");
function CreateDiv(id = "hit", x = 0, y = 0, imageLink = null, imageSize = "128") {
    var hitClone = hit.cloneNode();
    hitClone.id = id;
    /*hitClone.img = hitClone.children[0];
    hitClone.img.src = imageLink;
    hitClone.img.width = imageSize;
    hitClone.img.height = imageSize;*/
    hitClone.style.left = x_offset + x * size + "px";
    hitClone.style.top = y_offset + y * size + "px";
    document.getElementById("body").appendChild(hitClone);
	return hitClone;
}
for (var i = 0; i < grid.length; i++) {
    for (var v = 0; v < grid[i].length; v++) {
        if (grid[i][v] === 1) {
			CreateDiv("hit", v, i);
        }
    }
}
const player = document.getElementById("player");
console.log(y, x)
player.style.top = y * size + "px";
player.style.left = x * size + "px";
var cooldown = false;
function Movement(target) {
    if (cooldown === false) {
        var run = false;
        if (lastInput.z === true && y - 1 >= 0) {
            if (grid[y - 1][x] === 0) {
                y -= 1;
                run = true;
            }
        } else if (lastInput.s === true && y + 1 < grid.length) {
            if (grid[y + 1][x] === 0) {
                y += 1;
                run = true;
            }
        } else if (lastInput.d === true && x + 1 < grid[y].length) {
            if (grid[y][x + 1] === 0) {
                x += 1;
                run = true;
            }
        } else if (lastInput.q === true && x - 1 >= 0) {
            if (grid[y][x - 1] === 0) {
                x -= 1;
                run = true;
            }
        } else if (z === true && y - 1 >= 0) {
            if (grid[y - 1][x] === 0) {
                y -= 1;
                run = true;
            }
        } else if (s === true && y + 1 < grid.length) {
            if (grid[y + 1][x] === 0) {
                y += 1;
                run = true;
            }
        } else if (d === true && x + 1 < grid[y].length) {
            if (grid[y][x + 1] === 0) {
                x += 1;
                run = true;
            }
        } else if (q === true && x - 1 >= 0) {
            if (grid[y][x - 1] === 0) {
                x -= 1;
                run = true;
            }
        } else {
            return 0;
        }
        if (run) {
            cooldown = true;
            var num = 0;
            Next();
            function Next() {
                num++
                if (num * speed >= size) {
                    target.style.left = x_offset + x * size + "px";
                    target.style.top = y_offset + y * size + "px";
                    old_x = x;
                    old_y = y;
                    cooldown = false;
                } else {
                    target.style.left = x_offset + old_x * size + (x - old_x) * num * speed + "px";
                    target.style.top = y_offset + old_y * size + (y - old_y) * num * speed + "px";
                    setTimeout(Next, 1);
                }
            }
        }
    }
}

var frames = 0
async function UpdateGuis() {
    document.getElementById("z").innerText = "z = " + z + " | " + lastInput.z;
    document.getElementById("s").innerText = "s = " + s + " | " + lastInput.s;
    document.getElementById("d").innerText = "d = " + d + " | " + lastInput.d;
    document.getElementById("q").innerText = "q = " + q + " | " + lastInput.q;
    document.getElementById("x").innerText = "x = " + x;
    document.getElementById("y").innerText = "y = " + (-y);
}
async function Update() {
    UpdateGuis();
    Movement(player);
}
function Render() { //DO NOT EDIT!
    frames++;
    Update(); //Some code to run every frame
    window.requestAnimationFrame(Render); //Callback for next frame
}
function Force() {
    document.getElementById("fps").innerText = frames + " FPS";
    if (frames >= 60) {
        document.getElementById("fps").style.color = "rgb(0, 255, 0)";
    } else if (frames >= 24) {
        document.getElementById("fps").style.color = "rgb(255, 150, 0)";
    } else {
        document.getElementById("fps").style.color = "rgb(255, 0, 0)";
    }
    frames = 0;
    setTimeout(Force, 1000)
}
function ToggleVisible() {
    if (document.getElementById("debug").style.visibility == "visible") {
        document.getElementById("debug").style.visibility = "hidden";
    } else {
        document.getElementById("debug").style.visibility = "visible"
    }
}
async function Get() {
	fetch("https://jygttgyy.up.railway.app/get").then((response) => {
		if (!response.ok) {
    		throw new Error(`HTTP error: ${response.status}`);
		}
    	return response.text();
	}).then((text) => {
    	document.getElementById("ip").innerText = `IP = ${text}`
	}).catch((error) => {
		console.log(error);
    	document.getElementById("ip").innerText = `IP = [N/A]`;
	});
}
setTimeout(Force, 1000);
Get();
setTimeout(Render);
function SetLastInput(key) {
    lastInput.z = false;
    lastInput.s = false;
    lastInput.d = false;
    lastInput.q = false;
    lastInput[key] = true;
}
addEventListener("keydown", (key) => {
    if (key.key == "z") {z = true; SetLastInput(key.key);}
    if (key.key == "s") {s = true; SetLastInput(key.key);}
    if (key.key == "d") {d = true; SetLastInput(key.key);}
    if (key.key == "q") {q = true; SetLastInput(key.key);}
    if (key.key == "ArrowUp") {z = true; SetLastInput("z");}
    if (key.key == "ArrowDown") {s = true; SetLastInput("s");}
    if (key.key == "ArrowRight") {d = true; SetLastInput("d");}
    if (key.key == "ArrowLeft") {q = true; SetLastInput("q");}
    if (key.key == "$") {ToggleVisible();}
});
addEventListener("keyup", (key) => {
    if (key.key == "z") {z = false; lastInput[key.key] = false;}
    if (key.key == "s") {s = false; lastInput[key.key] = false;}
    if (key.key == "d") {d = false; lastInput[key.key] = false;}
    if (key.key == "q") {q = false; lastInput[key.key] = false;}
    if (key.key == "ArrowUp") {z = false; lastInput.z = false;}
    if (key.key == "ArrowDown") {s = false; lastInput.s = false;}
    if (key.key == "ArrowRight") {d = false; lastInput.d = false;}
    if (key.key == "ArrowLeft") {q = false; lastInput.q = false;}
});
