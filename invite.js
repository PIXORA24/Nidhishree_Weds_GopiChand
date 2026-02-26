const events = {
  wedding: {
    title: "Wedding",
    video: "assets/wedding/video.mp4",
    audio: "assets/wedding/music.mp3",
    poster: "assets/wedding/bg.webp",
    calendarTitle: "Nidhishree & Gopi Chand Wedding",
    startDate: "2026-04-02T11:00:00+05:30",
    venue: "Vanitha Achuth Pai Convention Centre, Konchady, Mangaluru",
    lat: "12.908887",
    lng: "74.866511"
  },

  sangeet: {
    title: "Sangeet",
    video: "assets/sangeet/video.mp4",
    audio: "assets/sangeet/music.mp3",
    poster: "assets/sangeet/bg.webp",
    calendarTitle: "Nidhishree's Sangeet",
    startDate: "2026-03-29T18:30:00+05:30",
    venue: "Near Kadri Park, Vasanth Vihar, Mangaluru",
    lat: "12.888451",
    lng: "74.853508"
  }
};

/* =========================
   PLATFORM DETECTION
========================= */

const isIOS =
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

/* =========================
   PARAMS
========================= */

const params = new URLSearchParams(window.location.search);
const eventKey = params.get("event");

if (!events[eventKey]) {
  window.location.href = "index.html";
}

const data = events[eventKey];

/* =========================
   ELEMENTS
========================= */

const navDim = document.getElementById("navDim");
const video = document.getElementById("video");
const audio = document.getElementById("audio");
const overlay = document.getElementById("overlay");
const openBtn = document.getElementById("openBtn");
const mapBtn = document.getElementById("mapBtn");
const calendarBtn = document.getElementById("calendarBtn");
const actionBar = document.querySelector(".action-bar");

/* =========================
   SET CONTENT
========================= */

openBtn.textContent = `Tap to Open ${data.title} ✨`;

video.src = data.video;
video.poster = data.poster;
video.muted = true;
video.playsInline = true;

audio.src = data.audio;
audio.volume = 1;

/* =========================
   GOOGLE MAP (ALL DEVICES)
========================= */

mapBtn.href =
  "https://www.google.com/maps/dir/?api=1&destination=" +
  data.lat +
  "," +
  data.lng;

/* =========================
   SOUND STATE
========================= */

let soundOn = true;
let fadeInterval = null;
let navigatingAway = false;

/* =========================
   FADE HELPERS
========================= */

function stopFade() {
  clearInterval(fadeInterval);
}

function fadeOutAudio() {
  stopFade();

  fadeInterval = setInterval(() => {
    if (audio.volume > 0.05) {
      audio.volume -= 0.05;
    } else {
      audio.volume = 0;
      audio.pause();
      stopFade();
    }
  }, 40);
}

function fadeInAudio() {
  if (!soundOn || navigatingAway) return;

  stopFade();

  audio.volume = 0;

  audio.play().then(() => {
    fadeInterval = setInterval(() => {
      if (audio.volume < 0.95) {
        audio.volume += 0.05;
      } else {
        audio.volume = 1;
        stopFade();
      }
    }, 40);
  }).catch(() => {});
}

/* =========================
   NAVIGATION
========================= */

function navigateWithFade(url) {
  navigatingAway = true;
  navDim.classList.add("active");

  if (soundOn) fadeOutAudio();

  setTimeout(() => {
    window.location.href = url;
  }, 150);
}

mapBtn.addEventListener("click", (e) => {
  e.preventDefault();
  navigateWithFade(mapBtn.href);
});

calendarBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const start = new Date(data.startDate);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

  const formatGoogleDate = (date) =>
    date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const googleUrl =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    "&text=" + encodeURIComponent(data.calendarTitle) +
    "&dates=" + formatGoogleDate(start) + "/" + formatGoogleDate(end) +
    "&details=" + encodeURIComponent(data.title + " at " + data.venue) +
    "&location=" + encodeURIComponent(data.venue);

  navigateWithFade(googleUrl);
});

/* =========================
   COUNTDOWN
========================= */

const countdown = document.createElement("div");
countdown.className = "countdown-ambient";
actionBar.after(countdown);

const eventTime = new Date(data.startDate).getTime();

function updateCountdown() {
  const now = Date.now();
  const diff = eventTime - now;

  if (diff <= 0) {
    countdown.style.display = "none";
    clearInterval(timer);
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  countdown.innerHTML = `
    <div><span>${days}</span><small>Days</small></div>
    <div><span>${String(hours).padStart(2,"0")}</span><small>Hours</small></div>
    <div><span>${String(minutes).padStart(2,"0")}</span><small>Minutes</small></div>
    <div><span>${String(seconds).padStart(2,"0")}</span><small>Seconds</small></div>
  `;
}

const timer = setInterval(updateCountdown, 1000);
updateCountdown();

/* =========================
   START INVITE
========================= */

function startInvite() {
  overlay.style.display = "none";
  video.muted = false;
  video.play().catch(() => {});

  // iOS-safe direct user gesture unlock
  audio.volume = 0;
  audio.play().then(() => {
    fadeInAudio();
  }).catch(() => {});
}

if (isIOS) {
  openBtn.addEventListener("click", startInvite, { once: true });
} else {
  overlay.style.display = "none";
  setTimeout(startInvite, 300);
}


/* =========================
   VISIBILITY CONTROL
========================= */

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    audio.pause();
  }
});

/* =========================
   RETURN HANDLING (BFCache SAFE)
========================= */

window.addEventListener("pageshow", (event) => {
  navigatingAway = false;
  navDim.classList.remove("active");

  if (event.persisted && soundOn) {
    fadeInAudio();
  }

  video.play().catch(() => {});
});

window.addEventListener("focus", () => {
  if (navigatingAway) {
    navigatingAway = false;
    navDim.classList.remove("active");

    if (soundOn) {
      fadeInAudio();
    }
  }
});
