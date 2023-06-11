"use strict";

tsParticles.load("particles-container", {
  particles: {
    number: {
      value: 200,
    },
    size: {
      value: 1,
    },
    move: {
      enable: true,
    },
  },
});

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
let sessionLength = 25;
let shortBreakLength = 5;
let longBreakLength = 15;
let time = sessionLength * 60;
let sessionStatus = "Not started";
let currentInterval;
let typeOfSession = "";

updateUI();

const sound = new Howl({
  src: ["sound.wav"],
});

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
    sessionStatus == "Session not started"
  ) {
    startSession();
  } else if (sessionStatus == "Break not started") startBreak();
  else if (sessionStatus != "Paused") {
    pauseTimer();
  } else if (sessionStatus == "Paused") {
    resumeTimer();
  }
}

function startSession() {
  btnStart.textContent = "Pause";
  sessionStatus = "Session";
  time = sessionLength * 60;
  updateUI();
  currentInterval = setInterval(() => {
    time--;
    if (time <= 0) {
      sound.play();
      clearInterval(currentInterval);
      sessionStatus = "Break not started";
      currentSessionCount++;
      btnStart.textContent = "Start";
    }

    updateUI();
  }, 1000);
}

function startBreak() {
  btnStart.textContent = "Pause";
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
      btnStart.textContent = "Start";
      sound.play();

      completeReset();
    } else if (time <= 0) {
      sound.play();
      btnStart.textContent = "Start";
      clearInterval(currentInterval);
      sessionStatus = "Session not started";
    }
    updateUI();
  }, 1000);
  updateUI();
}

function completeReset() {
  btnStart.textContent = "Start";
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

function pauseTimer() {
  typeOfSession = sessionStatus;
  sessionStatus = "Paused";
  btnStart.textContent = "Resume";
  clearInterval(currentInterval);
  updateUI();
}

function resumeTimer() {
  btnStart.textContent = "Pause";
  sessionStatus = typeOfSession;

  currentInterval = setInterval(() => {
    time--;
    if (time <= 0) {
      sound.play();
      clearInterval(currentInterval);
      if (sessionStatus === "Session") {
        sessionStatus = "Break not started";
        currentSessionCount++;
        btnStart.textContent = "Start";
      } else if (sessionStatus === "Short break") {
        btnStart.textContent = "Start";
        sessionStatus = "Session not started";
      } else {
        btnStart.textContent = "Start";
        completeReset();
      }
    }

    updateUI();
  }, 1000);
}
