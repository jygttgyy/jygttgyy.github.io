const wait = (n = 1) => new Promise((resolve) => setTimeout(resolve, n * 1000));
const waitUntilEvent = (obj, event) => new Promise((resolve) => {
    const listener = () => {
        obj.removeEventListener(event, listener);
        resolve();
    }
    obj.addEventListener(event, listener);
})
const waitUntilKeyPressed = (key) => new Promise((resolve) => {
    Arrow(true);
    SetOnInput(key, function() {
        SetOnInput(key);
        Arrow(false);
        resolve();
    })
})
const audios = {
    soundEffects: {
        Change: new Audio('audios/Change.mp3'),
        In: new Audio('audios/In.mp3'),
        Out: new Audio('audios/Out.mp3'),
        Bells: new Audio('audios/Bells.mp3'),
        Reminder: new Audio('audios/Reminder.mp3'),
    },
    musics: {
        ["Twisted Clowns"]: new Audio('audios/Twisted_Clowns.mp3'),
        ["Jealous Doll"]: new Audio('audios/Jealous_Doll.mp3'),
        ["Dreaming Injection"]: new Audio('audios/Dreaming_Injection.mp3'),
    }
}
let settings = {
    backgroundMusic: 0.1,
    soundEffects: 0.5,
}
function ApplySettings() {
    for (let audio in audios.musics) {
        audios.musics[audio].loop = true;
        audios.musics[audio].volume = settings.backgroundMusic;
    }
    for (let audio in audios.soundEffects) {
        audios.soundEffects[audio].volume = settings.soundEffects;
    }
}
ApplySettings();
let buttons = document.querySelectorAll("button");
for (let button in buttons) {
    buttons[button].disabled = true;
}
const PlayAudio = (name, type = "soundEffects") => new Promise((resolve) => {
    if (!audios[type]) {
        console.warn(`Invalid type specified: "${type}"\nIgnoring PlayAudio request.`);
        return 0;
    } else if (!audios[type][name]) {
        console.warn(`Invalid name specified: "${name}"\nIgnoring PlayAudio request.`);
        return 0;
    }
    audios[type][name].currentTime = 0;
    audios[type][name].play();
    function OnEnded() {
        resolve();
        audios[type][name].removeEventListener("ended", OnEnded);
    }
    audios[type][name].addEventListener("ended", OnEnded);
})
const StopAudio = (name, time = 1) => new Promise((resolve) => {
    if (!audios.musics[name]) {
        console.warn(`Invalid name specified: "${type}"\nIgnoring StopAudio request.`);
        return 0;
    }
    if (time <= 0) {
        console.warn(`Invalid time specified: "${time}"\nIgnoring StopAudio request.`)
        return 0;
    }
    let start;
    let baseVolume = audios.musics[name].volume;
    function Next(dT) {
        var delta = (dT - start) / time * baseVolume / 1000;
        start = dT;
        if (audios.musics[name].volume - delta <= 0) {
            audios.musics[name].pause();
            audios.musics[name].volume = settings.backgroundMusic;
            resolve();
        } else {
            audios.musics[name].volume -= delta;
            window.requestAnimationFrame((ms) => Next(ms));
        }
    }
    window.requestAnimationFrame((ms) => {start = ms; Next(ms)});
})
const Enums = {
    InputTypes: {
        Up: "Up",
        Down: "Down",
        Right: "Right",
        Left: "Left",
        Interact: "Interact",
        Back: "Back",
    }
}
const Appear = (elementId = "", time = 1) => new Promise((resolve) => {
    let element = document.getElementById(elementId)
    if (element === null) {
        console.warn(`Invalid element ID specified: "${elementId}"\nIgnoring Appear request.`)
    }
    element.style.opacity = "0";
    if (time < 0) {
        console.warn(`Invalid time specified: "${time}"\nIgnoring Appear request.`)
        return 0;
    } else if (time === 0) {
        element.style.opacity = "1";
        resolve();
        return 0;
    }
    let start;
    function Next(dT) {
        var delta = (dT - start) / time / 1000;
        start = dT;
        if (parseFloat(element.style.opacity) + delta >= 1) {
            element.style.opacity = "1";
            resolve();
        } else {
            element.style.opacity = parseFloat(element.style.opacity) + delta
            window.requestAnimationFrame(Next);
        }
    }
    window.requestAnimationFrame((ms) => {start = ms; Next(ms)});
})
const Disappear = (elementId = "", time = 1) => new Promise((resolve) => {
    let element = document.getElementById(elementId)
    if (element === null) {
        console.warn(`Invalid element ID specified: "${elementId}"\nIgnoring Appear request.`)
    }
    if (time < 0) {
        console.warn(`Invalid time specified: "${time}"\nIgnoring Appear request.`)
        return 0;
    } else if (time === 0) {
        element.opacity = "0";
        element.style.backgroundImage = null;
        resolve();
        return 0;
    }
    let start;
    let baseOpacity = parseFloat(element.style.opacity);
    function Next(dT) {
        var delta = (dT - start) / time * baseOpacity / 1000;
        start = dT;
        if (parseFloat(element.style.opacity) - delta <= 0) {
            element.style.opacity = "0";
            element.style.backgroundImage = null;
            resolve();
        } else {
            element.style.opacity = parseFloat(element.style.opacity) - delta;
            window.requestAnimationFrame(Next);
        }
    }
    window.requestAnimationFrame((ms) => {start = ms; Next(ms)});
})
const FadeIn = (time = 1) => new Promise((resolve) => {
    let fade = document.getElementById("fade");
    let start;
    function Next(dT) {
        var delta = (dT - start) / time / 1000;
        start = dT;
        if (parseFloat(fade.style.opacity) + delta >= 1) {
            fade.style.opacity = "1";
            resolve();
        } else {
            fade.style.opacity = parseFloat(fade.style.opacity) + delta;
            window.requestAnimationFrame(Next);
        }
    }
    window.requestAnimationFrame((ms) => {start = ms; Next(ms)});
})
const FadeOut = (time = 1) => new Promise((resolve) => {
    let fade = document.getElementById("fade");
    let start;
    let baseOpacity = parseFloat(fade.style.opacity);
    function Next(dT) {
        var delta = (dT - start) / time * baseOpacity / 1000;
        start = dT;
        if (parseFloat(fade.style.opacity) - delta <= 0) {
            fade.style.opacity = "0";
            resolve();
        } else {
            fade.style.opacity = parseFloat(fade.style.opacity) - delta;
            window.requestAnimationFrame(Next);
        }
    }
    window.requestAnimationFrame((ms) => {start = ms; Next(ms)});
})

const ShowChat = (textPart) => new Promise(async (resolve) => {
    let chat = document.getElementById("chat");
    let character = chat.querySelector("#character")
    let text = chat.querySelector("#content")
    if (!chat.classList.contains("in")) {
        chat.classList.remove("off");
        chat.classList.add("in");
    }
    if (characters[textPart.author].name === "") {
        character.style.opacity = 0;
        character.innerText = "_";
    } else {
        character.style.opacity = 1;
        character.innerText = characters[textPart.author].name;
    }
    text.style.color = characters[textPart.author].color;
    let txt
    if (characters[textPart.author]["has\""]) {
        txt = `\"${textPart.text}\"`;
    } else {
        txt = `${textPart.text}`;
    }
    let i = txt.length;
    function Next() {
        if (i <= 1) {
            text.innerText = txt;
            resolve();
        } else {
             i--
            text.innerText = txt.slice(0, -i);
            setTimeout(Next, 24);
        }
    }
    Next();
})
const HideChat = () => new Promise(async (resolve) => {
    chat.querySelector("#character").innerText = "";
    chat.querySelector("#content").innerText = "";
    chat.classList.remove("in");
    chat.classList.add("off");
    resolve();
})
function Arrow(on) {
    if (on) {
        document.getElementById("arrow").style.visibility = "visible";
    } else {
        document.getElementById("arrow").style.visibility = "hidden";
    }
}
let inputsHistory = [];
let allButtons = {
    intro: {
        focusedButton: 0,
        buttons: [
            document.getElementById("New Game"),
            document.getElementById("Continue"),
            document.getElementById("Options"),
            document.getElementById("Credits"),
            document.getElementById("Quit Game")
        ],
        story: async function() {
            SetOnInput(Enums.InputTypes.Up);
            SetOnInput(Enums.InputTypes.Down);
            SetOnInput(Enums.InputTypes.Left);
            SetOnInput(Enums.InputTypes.Right);
            SetOnInput(Enums.InputTypes.Back);
            SetOnInput(Enums.InputTypes.Interact);
            document.getElementById("introButtons").classList.remove("in");
            document.getElementById("introButtons").classList.add("out");
            StopAudio("Twisted Clowns", 2);
            await FadeIn(1);
            document.getElementById("intro").style.visibility = "hidden";
            document.getElementById("asset0").style.backgroundImage = `url("img/pictures/keys.png")`;
            document.getElementById("asset1").style.backgroundImage = `url("img/pictures/ch1.png")`;
            document.getElementById("asset2").style.backgroundImage = 'url("images/WithoutInteraction.png")';
            document.getElementById("asset3").style.backgroundImage = 'url("images/WithInteraction.png")';
            document.getElementById("asset4").style.backgroundImage = 'url("images/EyesClosed.png")';
            document.getElementById("asset5").style.backgroundImage = 'url("images/EyesOpened.png")';
            document.getElementById("game").style.visibility = "visible";
            Appear("asset0", 0);
            await FadeOut(1);
            await waitUntilKeyPressed(Enums.InputTypes.Interact);
            await Disappear("asset0", 1);
            PlayAudio("Bells");
            await Appear("asset1", 1);
            await wait(0.5);
            await Disappear("asset1", 1);
            PlayAudio("Jealous Doll", "musics");
            Appear("asset2", 1);
            await wait(0.5);
            await ShowChat(text.Main0);
            await waitUntilKeyPressed(Enums.InputTypes.Interact);
            Appear("asset3", 0.5);
            await ShowChat(text.Main1);
            await waitUntilKeyPressed(Enums.InputTypes.Interact);
            await ShowChat(text.Main2);
            await waitUntilKeyPressed(Enums.InputTypes.Interact);
            await ShowChat(text.Main3);
            await waitUntilKeyPressed(Enums.InputTypes.Interact);
            await ShowChat(text.Main4);
            await waitUntilKeyPressed(Enums.InputTypes.Interact);
            Disappear("asset2", 0.5);
            HideChat();
            await Disappear("asset3", 0.5);
            await wait(0.2);
            await ShowChat(text.Main5);
            await waitUntilKeyPressed(Enums.InputTypes.Interact);
            StopAudio("Jealous Doll", 1);
            HideChat();
            PlayAudio("Reminder");
            await wait(1);
            await Appear("asset4", 1);
            await Appear("asset5", 1);
            await FadeIn(1);
            Disappear("asset4", 0);
            Disappear("asset5", 0);
            document.getElementById("asset0").style.backgroundImage = 'url("images/RoomMain.png")';
            document.getElementById("rightChar").src = "img/faces/s_weak[BUST].png";
            Appear("asset0", 0)
            FadeOut(1);
            await wait(1);
            PlayAudio("Dreaming Injection", "musics");
            await ShowChat(text.Main6);
            await waitUntilKeyPressed(Enums.InputTypes.Interact);
            Appear("rightChar", 0.5);
            await ShowChat(text.Main7);
            await waitUntilKeyPressed(Enums.InputTypes.Interact);
            Disappear("rightChar", 0.5);
            await ShowChat(text.Main8);
            await waitUntilKeyPressed(Enums.InputTypes.Interact);
            await ShowChat(text.Main9);
            await waitUntilKeyPressed(Enums.InputTypes.Interact);
            await ShowChat(text.Main10);
            await waitUntilKeyPressed(Enums.InputTypes.Interact);
            HideChat();
        },
        switch: async function() {
            switch (this.focusedButton) {
                case 0:
                    this.story();
                    break
                case 1:
                    break
                case 2:
                    currentButtons = allButtons.options;
                    document.getElementById("introButtons").classList.remove("in");
                    document.getElementById("introButtons").classList.add("out");
                    document.getElementById("optionsButtons").classList.remove("out");
                    document.getElementById("optionsButtons").classList.add("in");
                    document.getElementById("fade").style.opacity = 0.3;
                    wait(0.5)
                    SetOnInput(Enums.InputTypes.Interact);
                    await waitUntilKeyPressed(Enums.InputTypes.Back);
                    currentButtons = allButtons.intro;
                    PlayAudio("Out");
                    document.getElementById("optionsButtons").classList.remove("in");
                    document.getElementById("optionsButtons").classList.add("out");
                    document.getElementById("introButtons").classList.remove("out");
                    document.getElementById("introButtons").classList.add("in");
                    document.getElementById("fade").style.opacity = 0;
                    SetOnInput(Enums.InputTypes.Back);
                    SetOnInput(Enums.InputTypes.Interact, FocusedButtonClick);
                    break
                case 3:
                    SetOnInput(Enums.InputTypes.Interact);
                    StopAudio("Twisted Clowns", 1);
                    await FadeIn(1);
                    document.getElementById("credits").style.visibility = "visible";
                    await FadeOut(1);
                    async function callback() {
                        SetOnInput([Enums.InputTypes.Interact, Enums.InputTypes.Back]);
                        await FadeIn(1)
                        document.getElementById("credits").style.visibility = "hidden";
                        await FadeOut(1)
                        PlayAudio("Twisted Clowns", "musics");
                        SetOnInput(Enums.InputTypes.Interact, FocusedButtonClick);
                    }
                    SetOnInput([Enums.InputTypes.Interact, Enums.InputTypes.Back], callback);
                    break
                case 4:
                    /*window.location.replace("https://jygttgyy.github.io");*/
                    break
            }
        }
    },
    options: {
        focusedButton: 0,
        buttons: [
            document.getElementById("UI_Hints"),
            document.getElementById("textSpeed"),
            document.getElementById("autoSaves"),
            document.getElementById("fullscreen"),
            document.getElementById("alwaysRun"),
            document.getElementById("runSpeed"),
            document.getElementById("BGM"),
            document.getElementById("SFX")
        ],
        switch: function(e = 0.01) {
            switch (this.focusedButton) {
                case 6:
                    settings.backgroundMusic += e;
                    if (settings.backgroundMusic > 1) {
                        settings.backgroundMusic = 0;
                    } else if (settings.backgroundMusic < 0) {
                        settings.backgroundMusic = 1; 
                    }
                    this.buttons[this.focusedButton].querySelector("p").innerText = Math.round(settings.backgroundMusic * 100) + "%";
                    ApplySettings();
                    break
                case 7:
                    settings.soundEffects += e;
                    if (settings.soundEffects > 1) {
                        settings.soundEffects = 0;
                    } else if (settings.soundEffects < 0) {
                        settings.soundEffects = 1; 
                    }
                    this.buttons[this.focusedButton].querySelector("p").innerText = Math.round(settings.soundEffects * 100) + "%";
                    ApplySettings();
                    break
            }
        }
    },
    inGame: {
        focusedButton: 0,
        buttons: [
            document.getElementById("item"),
            document.getElementById("options"),
            document.getElementById("controls"),
            document.getElementById("save"),
            document.getElementById("load"),
            document.getElementById("quit")
        ],
        switch: function() {
            switch (this.focusedButton) {
                case 0:

                    break
                case 1:

                    break
                case 2:

                    break
                case 3:

                    break
                case 4:

                    break
                case 5:

                    break
            }
        }
    }
};
let currentButtons = allButtons.intro;
function SetFocusedButton(num) {
    PlayAudio("Change");
    currentButtons.buttons[currentButtons.focusedButton].classList.remove("focused");
    currentButtons.focusedButton -= num;
    if (currentButtons.focusedButton === currentButtons.buttons.length) {
        currentButtons.focusedButton = 0;
    } else if (currentButtons.focusedButton < 0) {
        currentButtons.focusedButton = currentButtons.buttons.length - 1;
    }
    currentButtons.buttons[currentButtons.focusedButton].classList.add("focused");
}
let cooldown = false;
let Cooldowns = {
    Up: false,
    Down: false,
    Left: false,
    Right: false,
    Interact: false,
    Back: false
}
let OnClick = {
    Up: function() {},
    Down: function() {},
    Left: function() {},
    Right: function() {},
    Sprint: function() {},
    FastFoward: function() {},
    Interact: function() {},
    Back: function() {}
}
function SetOnInput(type, callback = function() {}) {
    if (typeof(type) === "object") {
        for (let i in type) {
            let t = type[i];
            if (!OnClick[t]) {
                console.warn(`Invalid type specified: "${t}"\nIgnoring SetOnInput request.`);
                return 0;
            }
            OnClick[t] = function() {
                if (!Cooldowns[t]) {
                    Cooldowns[t] = true;
                    callback();
                    setTimeout(function() {Cooldowns[t] = false;}, 120);
                }
            };
        }
    } else {
        if (!OnClick[type]) {
            console.warn(`Invalid type specified: "${type}"\nIgnoring SetOnInput request.`);
            return 0;
        }
        OnClick[type] = function() {
            if (!Cooldowns[type]) {
                Cooldowns[type] = true;
                callback();
                setTimeout(function() {Cooldowns[type] = false;}, 120);
            }
        };
    }
}
function FocusedButtonClick(arg) {
    PlayAudio("In");
    currentButtons.switch(arg);
}
function ReturnClearKey(key) {
    let code = null;
    switch (key) {
        case "KeyW":
        case "ArrowUp":
            code = "Up";
            break
        case "KeyS":
        case "ArrowDown":
            code = "Down";
            break
        case "KeyA":
        case "ArrowLeft":
            code = "Left";
            break
        case "KeyD":
        case "ArrowRight":
            code = "Right";
            break
        case "ShiftLeft":
        case "ShiftRight":
            code = "Sprint";
            break
        case "KeyF":
        case "PageDown":
            code = "FastFoward";
            break
        case "Enter":
        case "Space":
        case "KeyE":
        case "KeyZ":
            code = "Interact";
            break
        case "Escape":
        case "KeyQ":
        case "KeyX":
            code = "Back";
            break
        default:
            code = key;
            break
    }
    return code;
}
addEventListener("keydown", async (key) => {
    let code = ReturnClearKey(key.code);
    if (inputsHistory.indexOf(code) === -1) {
        inputsHistory.unshift(code);
    }
    // Keys Interactions
    if (inputsHistory.indexOf("Up") > -1) {
        OnClick.Up();
    } else if (inputsHistory.indexOf("Down") > -1) {
        OnClick.Down();
    } else if (inputsHistory.indexOf("Left") > -1) {
        OnClick.Left();
    } else if (inputsHistory.indexOf("Right") > -1) {
        OnClick.Right();
    } else if (inputsHistory.indexOf("Sprint") > -1) {
        OnClick.Sprint();
    } else if (inputsHistory.indexOf("FastFoward") > -1) {
        OnClick.FastFoward();
    } else if (inputsHistory.indexOf("Interact") > -1) {
        OnClick.Interact();
    } else if (inputsHistory.indexOf("Back") > -1) {
        OnClick.Back();
    }
});
addEventListener("keyup", async (key) => {
    let index = inputsHistory.indexOf(ReturnClearKey(key.code));
    if (index > -1) {
        inputsHistory.splice(index, 1);
    }
});
async function ActivateAudio() {
    if (navigator.userActivation.hasBeenActive) {
        document.getElementById("introButtons").classList.add("in");
        PlayAudio("Twisted Clowns", "musics");
        SetOnInput(Enums.InputTypes.Up, function() {SetFocusedButton(1);});
        SetOnInput(Enums.InputTypes.Down, function() {SetFocusedButton(-1);});
        await FadeOut(1);
        SetOnInput(Enums.InputTypes.Right, FocusedButtonClick);
        SetOnInput(Enums.InputTypes.Left, function() {FocusedButtonClick(-0.01)});
        SetOnInput(Enums.InputTypes.Interact, FocusedButtonClick);
        ActivateAudio = null;
    } else {
        setTimeout(ActivateAudio, 50);
    }
}
ActivateAudio();
function Resize() {
    document.querySelector("body").style.height = Math.round(window.innerHeight / 10) * 10 + "px";
}
window.addEventListener("resize", Resize);
Resize();
//document.addEventListener('contextmenu', event => event.preventDefault());
const characters = {
    "Ashley": {
        "name": "Ashley",
        "color": "rgb(230, 130, 190)",
        "has\"": true
    },
    "Leyley": {
        "name": "Leyley",
        "color": "rgb(230, 130, 190)",
        "has\"": true
    },
    "Andrew": {
        "name": "Andrew",
        "color": "rgb(230, 130, 190)",
        "has\"": true
    },
    "Andy": {
        "name": "Andy",
        "color": "rgb(130, 200, 110)",
        "has\"": true
    },
    "": {
        "name": "",
        "color": "rgb(200, 200, 185)",
        "has\"": false
    },
    "Cultist": {
        "name": "Cultist",
        "color": "rgb(255, 255, 0)",
        "has\"": true
    }
}
const text = {
    "Main0": {
        "author": "Andy",
        "text": "Leyley, I don't--... want to."
    },
    "Main1": {
        "author": "Leyley",
        "text": "Well I do."
    },
    "Main2": {
        "author": "Leyley",
        "text": "Just go over and __k _e_ to ____ __th you."
    },
    "Main3": {
        "author": "Andy",
        "text": "I thought she's your friend?"
    },
    "Main4": {
        "author": "Leyley",
        "text": "Mom said you'd help me with anything!"
    },
    "Main5": {
        "author": "Andy",
        "text": "We'll get in trouble..."
    },
    "Main6": {
        "author": "",
        "text": "Goooo-oood morning, Ashley!!",
	},
    "Main7": {
        "author": "Ashley",
        "text": "Ugh..........",
        "image": ""
	},
    "Main8": {
        "author": "",
        "text": "As much as you love feeling sorry for yourself,\nit is time for a little interlude..."
	},
    "Main9": {
        "author": "",
        "text": "It is titled: \"Find Nutrients To Not Die.\""
	},
    "Main10": {
        "author": "",
        "text": "Ready, set, go!"
	},
    "Main11": {
        "author": "",
        "text": "This is where you and your brother pile your trash."
    },
    "Main12": {
        "author": "",
        "text": "It's been scavenged several times, and is truly and utterly exhausted as a food source."
    },
    "Main13": {
        "author": "",
        "text": "But wait! What is that..?"
    },
    "Main14": {
        "notif": true,
        "author": "",
        "text": "Got a Can of Tomatoes!"
    },
    "Main15": {
        "author": "",
        "text": "Amazing! You should show that to your brother."
    },
    "Main16": {
        "author": "",
        "text": "You show him the Tomato Can."
    },
    "Main17": {
        "author": "Ashley",
        "text": "Tadaah!",
        "image": ""
    },
    "Main18": {
        "author": "Andrew",
        "text": ". . . . . . . . . . . . .",
        "image": ""
    },
    "Main19": {
        "author": "",
        "text": "Not the reaction you were hoping for..."
    },
    "Main20": {
        "author": "Ashley",
        "text": "A-hem...",
        "image": ""
    },
    "Main21": {
        "author": "Ashley",
        "text": "TADAAAAAAAHHH!!",
        "image": ""
    },
    "Main22": {
        "author": "Andrew",
        "text": "We're not eating that.",
        "image": ""
    },
    "Main23": {
        "author": "Ashley",
        "text": "Huh...?",
        "image": ""
    },
    "Main24": {
        "author": "Andrew",
        "text": "No. That's the very last thing we have, Ashley...",
        "image": ""
    },
    "Main25": {
        "author": "Andrew",
        "text": "Quit your complaining!",
        "image": ""
    },
    "Main26": {
        "author": "Andrew",
        "text": "You're energetic enough to go rummaging through\nour trash, so clearly you're not dying yet!",
        "image": ""
    },
    "Main27": {
        "author": "Ashley",
        "text": "Huh? How did you know it was in--",
        "image": ""
    },
    "Main28": {
        "author": "Andrew",
        "text": "Because I hid it there! Away from you.",
        "image": ""
    },
    "Main29": {
        "author": "Ashley",
        "text": "GASP!",
        "image": ""
    },
    "Main30": {
        "author": "Ashley",
        "text": "I live in a den of snakes!!",
        "image": ""
    },
    "Main31": {
        "author": "Andrew",
        "text": "Ahh, don't rile me up... You're making me hungry.",
        "image": ""
    },
    "Main32": {
        "author": "Ashley",
        "text": "Do you know what would help with that, Andrew my dear?",
        "image": ""
    },
    "Main33": {
        "author": "Andrew",
        "text": "No. Put the tomatoes away somewhere.",
        "image": ""
    },
    "Main34": {
        "author": "Ashley",
        "text": "Put them in my mouth, I will!",
        "image": ""
    },
    "Main35": {
        "author": "Andrew",
        "text": "........I can see that your heart is set on this.",
        "image": ""
    },
    "Main36": {
        "author": "Andrew",
        "text": "Fine. Let's eat them then.\nScrew our future selves.",
        "image": ""
    },
    "Main37": {
        "author": "",
        "text": "Time for you to go cook some tomatoes."
    },
    "Main38": {
        "author": "Ashley",
        "text": "Sighhhh.....",
        "image": ""
    },
    "Main39": {
        "author": "",
        "text": "You boil the canned tomatoes to make\ndelicious boiled canned tomatoes!"
    },
    "Main40": {
        "author": "",
        "text": "There's even a little bit of pepper left to season\nwith! This is some gourmet stuff right there."
    },
    "Main41": {
        "author": "",
        "text": "No salt though."
    },
    "Main42": {
        "author": "",
        "text": "You've used all of it to spike your water, in order to avoid\noverhydrating yourself while drinking to fill your stomach."
    },
    "Main43": {
        "author": "Ashley",
        "text": "....Well? How is it?",
        "image": ""
    },
    "Main44": {
        "author": "Andrew",
        "text": "At this point you could feed me a can of worms and I'd say it's the best thing I ever ate...",
        "image": ""
    },
    "Main45": {
        "author": "Ashley",
        "text": "Kiss-ass.",
        "image": ""
    },
    "Main46": {
        "author": "Andrew",
        "text": "No, I'm saying that's how hungry I am!!",
        "image": ""
    },
    "Main47": {
        "author": "",
        "text": "It is at that moment that an ominous\naudio assaults your ear drums."
    },
    "Main48": {
        "author": "Andrew",
        "text": "............Are you kidding me? The\nneighbor is at it again??",
        "image": ""
    },
    "Main49": {
        "author": "Ashley",
        "text": "Wanna go take a peek?",
        "image": ""
    },
    "Main50": {
        "author": "Andrew",
        "text": "Nope.",
        "image": ""
    },
    "Main51": {
        "author": "Andrew",
        "text": "But I'll come along if you do...",
        "image": ""
    },
    "Main52": {
        "author": "Andrew",
        "text": "Here. Catch.",
        "image": ""
    },
    "Main53": {
        "notif": true,
        "author": "",
        "text": "Got Balcony Key!"
    },
    "Main54": {
        "author": "Andrew",
        "text": "Hmm... Can't really squat from here."
    },
    "Main55": {
        "notif": true,
        "author": "",
        "text": "Got a Wooden Plank!"
    },
    "Main56": {
        "notif": true,
        "author": "",
        "text": "Set down the Wooden Plank!"
    },
    "Main57": {
        "author": "Ashley",
        "text": ". . . . . . . . .",
        "image": ""
    },
    "Main58": {
        "author": "Cultist",
        "text": "OOOOH, DEMONS FROM HELL!!"
    },
    "Main59": {
        "author": "Cultist",
        "text": "HEAR MY PLEA!"
    },
    "Main60": {
        "author": "Cultist",
        "text": "OOH, THE UNHOLY ONES!\nI COME SEEKING YOUR ADVICE!!"
    },
    "Main61": {
        "author": "Cultist",
        "text": "........................................"
    }
}

