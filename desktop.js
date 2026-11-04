"use strict";

const counterStatus = document.querySelector("#counter-status");
const counterBadge = document.querySelector("#counter-badge");

if (location.hostname === "nikhila-kuchimanchi.github.io") {
  counterStatus.textContent = "HITS · LOADING";
  counterBadge.addEventListener("load", () => {
    counterStatus.hidden = true;
    counterBadge.hidden = false;
  }, { once: true });
  counterBadge.addEventListener("error", () => {
    counterStatus.textContent = "HITS · OFFLINE";
  }, { once: true });
  counterBadge.src = "https://hits.sh/nikhila-kuchimanchi.github.io.svg?label=PAGE%20HITS&labelColor=302538&color=cce4d8&style=flat-square";
}

const clock = document.querySelector("#desktop-clock");
const localTime = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" });

function updateClock() {
  clock.textContent = localTime.format(new Date());
}
updateClock();
window.setInterval(updateClock, 1000 * 15);

const musicButton = document.querySelector("#music-toggle");
const music = document.querySelector("#desktop-audio");
music.volume = 0.35;
musicButton.hidden = false;

function syncMusicButton() {
  musicButton.setAttribute("aria-pressed", String(!music.paused));
  musicButton.textContent = music.paused ? "♫ Music off" : "♫ Music on";
}
music.addEventListener("play", syncMusicButton);
music.addEventListener("pause", syncMusicButton);
musicButton.addEventListener("click", async () => {
  if (!music.paused) {
    music.pause();
    return;
  }
  try {
    await music.play();
  } catch (error) {
    if (error.name !== "AbortError") {
      musicButton.textContent = "♫ Unavailable";
    }
  }
});

const bunny = document.querySelector("#desktop-bunny");
const bunnyButton = document.querySelector("#bunny-toggle");
const mouseAvailable = window.matchMedia("(hover: hover) and (pointer: fine)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let enabled = true;
let frame = 0;
let x = 0;
let y = 0;
let targetX = 0;
let targetY = 0;
let facing = 1;

function hideBunny() {
  if (frame) {
    window.cancelAnimationFrame(frame);
    frame = 0;
  }
  bunny.hidden = true;
  bunny.classList.remove("is-hopping");
}

function syncBunnyButton() {
  bunnyButton.hidden = !mouseAvailable.matches || reducedMotion.matches;
  bunnyButton.textContent = enabled ? "Bunny on" : "Bunny off";
  bunnyButton.setAttribute("aria-pressed", String(enabled));
  if (!enabled || bunnyButton.hidden) {
    hideBunny();
  }
}

function followPointer() {
  const dx = targetX - x;
  const dy = targetY - y;
  const moving = Math.abs(dx) + Math.abs(dy) > 2;
  x = moving ? x + dx * 0.15 : targetX;
  y = moving ? y + dy * 0.15 : targetY;
  if (Math.abs(dx) > 3) {
    facing = dx > 0 ? 1 : -1;
    bunny.style.setProperty("--bunny-facing", facing);
  }
  bunny.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
  bunny.classList.toggle("is-hopping", moving);
  frame = moving ? window.requestAnimationFrame(followPointer) : 0;
}

window.addEventListener("pointermove", (event) => {
  if (event.pointerType !== "mouse" || !enabled || bunnyButton.hidden) {
    return;
  }
  const maxX = window.innerWidth - bunny.firstElementChild.width.baseVal.value - 4;
  targetX = Math.max(4, Math.min(maxX, event.clientX + 18));
  const offsetY = event.clientX + 18 > maxX ? 25 : 12;
  targetY = Math.max(5, Math.min(window.innerHeight - 68, event.clientY + offsetY));
  if (bunny.hidden) {
    x = targetX;
    y = targetY;
    bunny.hidden = false;
  }
  if (!frame) {
    frame = window.requestAnimationFrame(followPointer);
  }
}, { passive: true });

bunnyButton.addEventListener("click", () => {
  enabled = !enabled;
  syncBunnyButton();
});
mouseAvailable.addEventListener("change", syncBunnyButton);
reducedMotion.addEventListener("change", syncBunnyButton);
document.documentElement.addEventListener("pointerleave", hideBunny);
window.addEventListener("blur", hideBunny);
window.addEventListener("resize", hideBunny);
syncBunnyButton();


const starButton = document.querySelector("#star-button");
const starShower = document.querySelector("#star-shower");
let starTimer;

function showStars() {
  window.clearTimeout(starTimer);
  const stars = document.createDocumentFragment();
  const colors = ["#f38fbd", "#c896e7", "#e1b5f0", "#f6b7d2"];
  for (let i = 0; i < 34; i += 1) {
    const star = document.createElement("span");
    star.textContent = i % 3 === 0 ? "★" : "✦";
    star.style.setProperty("--left", `${(i + Math.random()) / 34 * 98}%`);
    star.style.setProperty("--rest-top", `${15 + Math.random() * 65}px`);
    star.style.setProperty("--color", colors[i % colors.length]);
    star.style.setProperty("--size", `${14 + Math.random() * 15}px`);
    star.style.setProperty("--duration", `${1.45 + Math.random() * 1.15}s`);
    star.style.setProperty("--delay", `${i < 8 ? 0 : Math.random() * 0.65}s`);
    star.style.setProperty("--drift", `${Math.random() * 130 - 65}px`);
    star.style.setProperty("--spin", `${Math.random() * 440 - 220}deg`);
    stars.append(star);
  }
  starShower.replaceChildren(stars);
  starTimer = window.setTimeout(() => starShower.replaceChildren(), reducedMotion.matches ? 1600 : 3500);
}
starButton.hidden = false;
for (const trigger of document.querySelectorAll("[data-star-shower]")) {
  trigger.addEventListener("click", showStars);
}

const signalButton = document.querySelector("#signal-button");
const signalMessage = document.querySelector("#signal-message");
const signals = ["HELLO, INTERNET!", "BUNNY STATUS: SEEKING CARROTS", "SIGNAL RECEIVED ♡"];
let nextSignal = 0;
signalButton.hidden = false;
signalButton.addEventListener("click", () => {
  signalMessage.textContent = signals[nextSignal];
  nextSignal = (nextSignal + 1) % signals.length;
});
