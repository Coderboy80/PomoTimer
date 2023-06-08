"use strict";

const textTimer = document.getElementById("text-timer");
const textSessionCount = document.getElementById("text-session-count");
const btnStart = document.getElementById("btn-start");
const btnReset = document.getElementById("btn-reset");
const textSessionStatus = document.getElementById("text-status");
const btnSettings = document.getElementById("btn-settings");
const settingsModal = document.getElementById("modal-settings");
const btnSubmitForm = document.getElementById("btn-submit-form");
const inputSessionLength = document.getElementById("input-session-length");
const inputMaxSessionCount = document.getElementById("input-max-session-count");
const inputShortbreakLength = document.getElementById(
  "input-short-break-length"
);
const inputlongBreakLength = document.getElementById("input-long-break-length");

let maxSessionCount = 4;
let currentSessionCount = 0;
let sessionLength = 0.1;
let shortBreakLength = 0.05;
let longBreakLength = 0.075;
let time = sessionLength * 60;
let sessionStatus = "Not started";
let currentInterval;

updateUI();

btnStart.addEventListener("click", startTimer);
btnReset.addEventListener("click", completeReset);
btnSettings.addEventListener("click", openSettings);
btnSubmitForm.addEventListener("click", submitForm);

function openSettings() {
  settingsModal.showModal();
}

function submitForm() {
  sessionLength = inputSessionLength.value;
  maxSessionCount = inputMaxSessionCount.value;
  shortBreakLength = inputShortbreakLength.value;
  longBreakLength = inputlongBreakLength.value;
  completeReset();
}

function startTimer() {
  if (
    sessionStatus == "Not started" ||
    sessionStatus == "Session" ||
    sessionStatus == "Session not started"
  ) {
    startSession();
  } else startBreak();
}

function startSession() {
  sessionStatus = "Session";
  time = sessionLength * 60;
  updateUI();
  currentInterval = setInterval(() => {
    time--;
    if (time <= 0) {
      clearInterval(currentInterval);
      sessionStatus = "Break not started";
      currentSessionCount++;
    }

    updateUI();
  }, 1000);
}

function startBreak() {
  if (currentSessionCount > maxSessionCount) {
    completeReset();
    return;
  }
  if (currentSessionCount < maxSessionCount) {
    sessionStatus = "Short break";

    time = shortBreakLength * 60;
  } else {
    sessionStatus = "Long break";

    time = longBreakLength * 60;
  }
  currentInterval = setInterval(() => {
    time--;
    if (time <= 0 && sessionStatus == "Long break") {
      completeReset();
    } else if (time <= 0) {
      clearInterval(currentInterval);
      sessionStatus = "Session not started";
    }

    updateUI();
  }, 1000);
  updateUI();
}

function completeReset() {
  console.log(sessionLength);
  currentSessionCount = 0;
  clearInterval(currentInterval);
  time = sessionLength * 60;
  sessionStatus = "Not started";
  updateUI();
}

function updateUI() {
  const minutes = String(Math.trunc(time / 60)).padStart(2, "0");
  const seconds = String(time % 60).padStart(2, "0");
  textTimer.textContent = `${minutes}:${seconds}`;
  textSessionCount.textContent = `${currentSessionCount}/${maxSessionCount}`;
  textSessionStatus.textContent = sessionStatus;
}
