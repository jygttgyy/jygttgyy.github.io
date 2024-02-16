const wait = (n) => new Promise((resolve) => setTimeout(resolve, n * 1000));
const waitUntilEvent = (obj, event) => new Promise((resolve) => {
    const listener = () => {
        obj.removeEventListener(event, listener);
        resolve();
    }
    obj.addEventListener(event, listener);
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
class funcReturn {
    constructor(time = 0, event = null) { // Object AND Event
        if (event != null) {
            this.wait = async function() {
                await waitUntilEvent(event[0], event[1]);
            }
        } else {
            this.wait = async function() {
                await wait(time);
            }
        }
    }
}
function PlayAudio(name, type = "soundEffects", callback) {
    if (!audios[type]) {
        console.warn(`Invalid type specified: "${type}"\nIgnoring PlayAudio request.`);
        return 0;
    } else if (!audios[type][name]) {
        console.warn(`Invalid name specified: "${name}"\nIgnoring PlayAudio request.`);
        return 0;
    }
    audios[type][name].currentTime = 0;
    audios[type][name].play();
    audios[type][name].addEventListener("ended", callback)
}
function PauseAudio(name, time = 1, callback = function() {}) {
    if (!audios.musics[name]) {
        console.warn(`Invalid name specified: "${type}"\nIgnoring PlayAudio request.`);
        return 0;
    }
    time *= 100;
    async function Next(i) {
        i--
        if (i < 0) {
            audios.musics[name].pause();
            audios.musics[name].volume = settings.backgroundMusic;
            callback();
            return new funcReturn();
        }
        audios.musics[name].volume = i / 10 / time;
        await wait(0.01);
        Next(i);
    }
    Next(time)
}
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
async function Fade(_in, time = 1, callback = function() {}, timeBeforeCallback = 0) {
    timeBeforeCallback *= 1000;
    time *= 100;
    let fade = document.getElementById("fade");
    if (_in) {
        for (var i = 0; i > time; i++) {
            fade.style.opacity = i / time;
            await wait(0.01);
        }
        fade.style.opacity = 1;
    } else {
        for (var i = 100; i <= 0; i--) {
            console.log("e");
            fade.style.opacity = i / time;
            await wait(0.01);
        }
        fade.style.opacity = 0;
    }
    setTimeout(callback, timeBeforeCallback);
    return new funcReturn(timeBeforeCallback);
}
async function ShowGame(visible) {
    if (visible) {
        document.getElementById("game").opacity = 0;
        document.getElementById("game").classList.add("in");
        document.getElementById("game").classList.remove("out");
    } else {
        document.getElementById("game").opacity = 1;
        document.getElementById("game").classList.add("out");
        document.getElementById("game").classList.remove("in");
    }
    await wait(0.6)
}
async function ShowChat(_in, textPart, callback = function() {}) {
    let chat = document.getElementById("chat");
    let character = chat.querySelector("#character")
    let text = chat.querySelector("#content")
    if (_in) {
        if (!chat.classList.contains("in")) {
            chat.classList.remove("off");
            chat.classList.add("in");
        }
        character.style.color = characters[textPart.author].color;
        character.innerText = characters[textPart.author].name;
        let txt
        if (characters[textPart.author]["has\""]) {
            txt = `\"${textPart.text}\"`;
        } else {
            txt = `${textPart.text}`;
        }
        let i = txt.length;
        for (i = txt.length; i <= 0; i--) {
            text.innerText = txt.slice(0, -i);
            await wait(0.024);
        }
        text.innerText = txt;
        callback();
        return new funcReturn();
    } else {
        chat.classList.remove("in");
        chat.classList.add("off");
        return new funcReturn(0.3)
    }
}
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
        switch: function() {
            var functions = [
                async function() {
                    SetOnInput(Enums.InputTypes.Up);
                    SetOnInput(Enums.InputTypes.Down);
                    SetOnInput(Enums.InputTypes.Left);
                    SetOnInput(Enums.InputTypes.Right);
                    SetOnInput(Enums.InputTypes.Back);
                    SetOnInput(Enums.InputTypes.Interact);
                    document.getElementById("introButtons").classList.remove("in");
                    document.getElementById("introButtons").classList.add("out");
                    PauseAudio("Twisted Clowns", 1.5);
                    await Fade(true, 1).wait()
                    document.getElementById("game").style.visibility = "visible";
                    await Fade(false, 1).wait()
                    Arrow(true);
                    SetOnInput(Enums.InputTypes.Interact, functions[1]);
                },
                async function() {
                    SetOnInput(Enums.InputTypes.Interact);
                    Arrow(false);
                    await Fade(true, 1, function() {}, 0.5).wait()
                    document.getElementById("game").style.backgroundImage = 'url("images/TheCoffin_Title.png")';
                    PlayAudio("Bells");
                    await Fade(false, 1).wait()
                    await Fade(true, 1, function() {}, 0.5).wait()
                    document.getElementById("game").style.backgroundImage = 'url("images/WithoutInteraction.png")';
                    PlayAudio("Jealous Doll", "musics");
                    await Fade(false, 1).wait()
                    await ShowChat(true, text.Main0).wait()
                    Arrow(true);
                    SetOnInput(Enums.InputTypes.Interact, functions[2]);
                },
                async function() {
                    SetOnInput(Enums.InputTypes.Interact);
                    Arrow(false);
                    ShowGame(false);
                    document.getElementById("game1").style.backgroundImage = 'url("images/WithInteraction.png")';
                    ShowChat(true, text.Main1, function() {
                        Arrow(true);
                        SetOnInput(Enums.InputTypes.Interact, functions[3]);
                    });
                },
                async function() {
                    SetOnInput(Enums.InputTypes.Interact);
                    Arrow(false);
                    ShowChat(true, text.Main2, function() {
                        Arrow(true);
                        SetOnInput(Enums.InputTypes.Interact, functions[4]);
                    });
                },
                async function() {
                    SetOnInput(Enums.InputTypes.Interact);
                    Arrow(false);
                    ShowChat(true, text.Main3, function() {
                        Arrow(true);
                        SetOnInput(Enums.InputTypes.Interact, functions[5]);
                    });
                },
                async function() {
                    SetOnInput(Enums.InputTypes.Interact);
                    Arrow(false);
                    ShowChat(true, text.Main4, function() {
                        Arrow(true);
                        SetOnInput(Enums.InputTypes.Interact, functions[6]);
                    });
                },
                async function() {
                    SetOnInput(Enums.InputTypes.Interact);
                    Arrow(false);
                    document.getElementById("game").style.backgroundImage = "url()";
                    document.getElementById("game").style.backgroundColor = 'rgb(0, 0, 0)';
                    ShowGame(true);
                    ShowChat(true, text.Main5, function() {
                        Arrow(true);
                        SetOnInput(Enums.InputTypes.Interact, functions[7]);
                    });
                },
                async function() {
                    PauseAudio("Jealous Doll", 1);
                    SetOnInput(Enums.InputTypes.Interact);
                    PlayAudio("Reminder");
                    Arrow(false);
                    ShowChat(false);
                    document.getElementById("game1").style.backgroundImage = 'url("images/EyesClosed.png")';
                    ShowGame(false);
                    await wait(1.5);
                    document.getElementById("game").style.backgroundImage = 'url("images/EyesOpened.png")';
                    ShowGame(true);
                    Fade(true, 1, function() {
                        Fade(false, 1, function() {
                            PlayAudio("Dreaming Injection", "musics")
                            ShowChat(true, text.Main6, function() {
                                SetOnInput(Enums.InputTypes.Interact, functions[8]);
                            })
                        })
                    }, 1)
                },
                function() {
                    SetOnInput(Enums.InputTypes.Interact);
                }
            ]
            switch (this.focusedButton) {
                case 0:
                    functions[0]();
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
                    SetOnInput(Enums.InputTypes.Back, function() {
                        currentButtons = allButtons.intro;
                        PlayAudio("Out");
                        document.getElementById("optionsButtons").classList.remove("in");
                        document.getElementById("optionsButtons").classList.add("out");
                        document.getElementById("introButtons").classList.remove("out");
                        document.getElementById("introButtons").classList.add("in");
                        document.getElementById("fade").style.opacity = 0;
                        SetOnInput(Enums.InputTypes.Back);
                        SetOnInput(Enums.InputTypes.Interact, FocusedButtonClick);
                    })
                    break
                case 3:
                    SetOnInput(Enums.InputTypes.Interact);
                    PauseAudio("Twisted Clowns", 1);
                    Fade(true, 1, function() {
                        document.getElementById("credits").style.visibility = "visible";
                        Fade(false, 1, function() {
                            function callback() {
                                SetOnInput(Enums.InputTypes.Back);
                                SetOnInput(Enums.InputTypes.Interact);
                                Fade(true, 1, function() {
                                    document.getElementById("credits").style.visibility = "hidden";
                                    Fade(false, 1, function() {
                                        PlayAudio("Twisted Clowns", "musics");
                                        SetOnInput(Enums.InputTypes.Interact, FocusedButtonClick);
                                    });
                                });
                            }
                            SetOnInput(Enums.InputTypes.Back, callback);
                            SetOnInput(Enums.InputTypes.Interact, callback);
                        });
                    });
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
function ActivateAudio() {
    if (navigator.userActivation.hasBeenActive) {
        document.getElementById("introButtons").classList.add("in");
        Fade(false, 1);
        PlayAudio("Twisted Clowns", "musics");
        SetOnInput(Enums.InputTypes.Up, function() {SetFocusedButton(1);});
        SetOnInput(Enums.InputTypes.Down, function() {SetFocusedButton(-1);});
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
        "author": "Ashley",
        "text": "Ugh.........."
	},
    "Main7": {
        "author": "",
        "text": "As much as you love feeling sorry for yourself,\nit is time for a little interlude..."
	},
    "Main8": {
        "author": "",
        "text": "It is titled: \"Find Nutrients To Not Die.\""
	},
    "Main9": {
        "author": "",
        "text": "Ready, set, go!"
	},
    "Main10": {
        "author": "",
        "text": "This is where you and your brother pile your trash."
    },
    "Main11": {
        "author": "",
        "text": "It's been scavenged several times, and is truly and utterly exhausted as a food source."
    },
    "Main12": {
        "author": "",
        "text": "But wait! What is that..?"
    },
    "Main13": {
        "notif": true,
        "author": "",
        "text": "Got a Can of Tomatoes!"
    },
    "Main14": {
        "author": "",
        "text": "Amazing! You should show that to your brother."
    },
    "Main15": {
        "author": "",
        "text": "You show him the Tomato Can."
    },
    "Main16": {
        "author": "Ashley",
        "text": "Tadaah!"
    },
    "Main17": {
        "author": "Andrew",
        "text": ". . . . . . . . . . . . ."
    },
    "Main18": {
        "author": "",
        "text": "Not the reaction you were hoping for..."
    },
    "Main19": {
        "author": "Ashley",
        "text": "A-hem..."
    },
    "Main20": {
        "author": "Ashley",
        "text": "TADAAAAAAAHHH!!"
    },
    "Main21": {
        "author": "Andrew",
        "text": "We're not eating that."
    },
    "Main22": {
        "author": "Ashley",
        "text": "Huh...?"
    },
    "Main23": {
        "author": "Andrew",
        "text": "No. That's the very last thing we have, Ashley..."
    },
    "Main24": {
        "author": "Andrew",
        "text": "Quit your complaining!"
    },
    "Main25": {
        "author": "Andrew",
        "text": "You're energetic enough to go rummaging through\nour trash, so clearly you're not dying yet!"
    },
    "Main26": {
        "author": "Ashley",
        "text": "Huh? How did you know it was in--"
    },
    "Main27": {
        "author": "Andrew",
        "text": "Because I hid it there! Away from you."
    },
    "Main28": {
        "author": "Ashley",
        "text": "GASP!"
    },
    "Main29": {
        "author": "Ashley",
        "text": "I live in a den of snakes!!"
    },
    "Main30": {
        "author": "Andrew",
        "text": "Ahh, don't rile me up... You're making me hungry."
    },
    "Main31": {
        "author": "Ashley",
        "text": "Do you know what would help with that, Andrew my dear?"
    },
    "Main32": {
        "author": "Andrew",
        "text": "No. Put the tomatoes away somewhere."
    },
    "Main33": {
        "author": "Ashley",
        "text": "Put them in my mouth, I will!"
    },
    "Main34": {
        "author": "Andrew",
        "text": "........I can see that your heart is set on this."
    },
    "Main35": {
        "author": "Andrew",
        "text": "Fine. Let's eat them then.\nScrew our future selves."
    },
    "Main36": {
        "author": "",
        "text": "Time for you to go cook some tomatoes."
    },
    "Main37": {
        "author": "Ashley",
        "text": "Sighhhh....."
    },
    "Main38": {
        "author": "",
        "text": "You boil the canned tomatoes to make\ndelicious boiled canned tomatoes!"
    },
    "Main39": {
        "author": "",
        "text": "There's even a little bit of pepper left to season\nwith! This is some gourmet stuff right there."
    },
    "Main40": {
        "author": "",
        "text": "No salt though."
    },
    "Main41": {
        "author": "",
        "text": "You've used all of it to spike your water, in order to avoid\noverhydrating yourself while drinking to fill your stomach."
    },
    "Main42": {
        "author": "Ashley",
        "text": "....Well? How is it?"
    },
    "Main43": {
        "author": "Andrew",
        "text": "At this point you could feed me a can of worms and I'd say it's the best thing I ever ate..."
    },
    "Main44": {
        "author": "Ashley",
        "text": "Kiss-ass."
    },
    "Main45": {
        "author": "Andrew",
        "text": "No, I'm saying that's how hungry I am!!"
    },
    "Main46": {
        "author": "",
        "text": "It is at that moment that an ominous\naudio assaults your ear drums."
    },
    "Main47": {
        "author": "Andrew",
        "text": "............Are you kidding me? The\nneighbor is at it again??"
    },
    "Main48": {
        "author": "Ashley",
        "text": "Wanna go take a peek?"
    },
    "Main49": {
        "author": "Andrew",
        "text": "Nope."
    },
    "Main50": {
        "author": "Andrew",
        "text": "But I'll come along if you do..."
    },
    "Main51": {
        "author": "Andrew",
        "text": "Here. Catch."
    },
    "Main52": {
        "notif": true,
        "author": "",
        "text": "Got Balcony Key!"
    },
    "Main53": {
        "author": "Andrew",
        "text": "Hmm... Can't really squat from here."
    },
    "Main54": {
        "notif": true,
        "author": "",
        "text": "Got a Wooden Plank!"
    },
    "Main55": {
        "notif": true,
        "author": "",
        "text": "Set down the Wooden Plank!"
    },
    "Main56": {
        "author": "Ashley",
        "text": ". . . . . . . . ."
    },
    "Main57": {
        "author": "Cultist",
        "text": "OOOOH, DEMONS FROM HELL!!"
    },
    "Main58": {
        "author": "Cultist",
        "text": "HEAR MY PLEA!"
    },
    "Main59": {
        "author": "Cultist",
        "text": "OOH, THE UNHOLY ONES!\nI COME SEEKING YOUR ADVICE!!"
    },
    "Main60": {
        "author": "Cultist",
        "text": "........................................"
    }
}

