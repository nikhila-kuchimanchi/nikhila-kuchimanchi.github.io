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

const bunny = document.querySelector("#pixel-bunny");
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
  const side = event.clientX < 70 ? 25 : -56;
  targetX = Math.max(4, Math.min(window.innerWidth - 46, event.clientX + side));
  targetY = Math.max(5, Math.min(window.innerHeight - 48, event.clientY + 17));
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
