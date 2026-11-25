const counterDisplay = document.querySelector(".counter");
const button = document.querySelector(".btn");

let clicks = 0;

button.addEventListener("click", () => {
    clicks++;
    makeSound();
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