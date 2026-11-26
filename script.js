const counterDisplay = document.querySelector(".counter");
const button = document.querySelector(".btn");
const bar = document.querySelector(".bar");
const levelStatsSpan = document.getElementById("levelStats");

const levels = [
    {"min": 0, "Multiplier": 1, "ClassNameCSS": "", "Name": "normal"},
    {"min": 20, "Multiplier": 2, "ClassNameCSS": "bronze", "Name": "Bronze"},
    {"min": 50, "Multiplier": 3, "ClassNameCSS": "golden", "Name": "Golden"},
    {"min": 100, "Multiplier": 5, "ClassNameCSS": "diamon", "Name": "Diamon"},
    {"min": 500, "Multiplier": 6, "ClassNameCSS": "dots", "Name": "Dots"},
    {"min": 1500, "Multiplier": 10, "ClassNameCSS": "rainbow", "Name": "Rainbow"},
    {"min": 5000, "Multiplier": 10, "ClassNameCSS": "", "Name": "Max"},
]

let clicks = 0;
let maxedOut = false;
let levelName = 0;
let multi = 1;

button.addEventListener("click", () => {
    clicks += 1 * multi;
    navigator.vibrate(15)
    makeSound();
    checkLevelsAndApplyChanges();
    counterDisplay.textContent = `${clicks}`;
})

function makeSound() {
    let audio = new AudioContext();

    let now = audio.currentTime;

    let oscilator = audio.createOscillator();
    let gain = audio.createGain();

    oscilator.frequency.setValueAtTime(90, now);
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.linearRampToValueAtTime(0.05, now + 0.1)

    oscilator.connect(gain).connect(audio.destination);
    oscilator.start();
    oscilator.stop(now + 0.15);
}

function checkLevelsAndApplyChanges() {
    if (maxedOut) {
        bar.textContent = "MAXED OUT";
        return;
    }

    let levelI = 0;
    let classNamesFromAllLevels = [];

    for (let i = 0; i < levels.length; i++) {
        if (clicks >= levels[i].min) {
            levelI = i;
            levelName = levels[i].Name;
        }

        classNamesFromAllLevels.push(levels[i].ClassNameCSS);
        if (levels[i].ClassNameCSS == "") {
            classNamesFromAllLevels.pop();
        }
    }

    let lastLevelMin = levels[levelI].min;
    let nextLevelMin = 0;

    if (levelI + 1 <= levels.length) {
        try {
            nextLevelMin = levels[levelI + 1].min;
        }
        catch (error) {
            maxedOut = true;
        }
    }

    levelStatsSpan.textContent = `Level: ${levelI} (${levels[levelI].Name}) | ${levels[levelI].Multiplier}x`

    const lastLevelMinSpan = document.getElementById("lastLevelMin");
    const nextLevelMinSpan = document.getElementById("nextLevelMin");

    lastLevelMinSpan.textContent = lastLevelMin;
    nextLevelMinSpan.textContent = nextLevelMin ? nextLevelMin : "MAX";

    let percent = (clicks / nextLevelMin) * 100;

    if (percent === Infinity) {
        bar.textContent = "MAXED OUT";
        bar.width = "100%";
        return;
    }

    bar.style.width = `${Math.round(percent)}%`;
    bar.textContent = `${Math.round(percent)}%`;

    for (let i = 0; i < classNamesFromAllLevels.length; i++) {
        button.classList.remove(classNamesFromAllLevels[i]);
    }
    
    if (levels[levelI].ClassNameCSS == "") {
        return;
    }
    button.classList.add(levels[levelI].ClassNameCSS);

    multi = levels[levelI].Multiplier;
}