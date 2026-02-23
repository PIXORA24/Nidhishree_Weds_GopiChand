/* =========================
   EVENT CONFIG
   ========================= */

const events = {
  wedding: {
    title: "Wedding",
    video: "assets/wedding/video.mp4",
    audio: "assets/wedding/music.mp3",
    poster: "assets/wedding/bg.jpg",
    map: "https://maps.google.com",
    calendarTitle: "Aarthi & Rohit Wedding",
    startDate: "2026-02-14T10:30:00+05:30"
  },
  reception: {
    title: "Reception",
    video: "assets/reception/video.mp4",
    audio: "assets/reception/music.mp3",
    poster: "assets/reception/bg.jpg",
    map: "https://maps.google.com",
    calendarTitle: "Aarthi & Rohit Reception",
    startDate: "2026-02-15T19:00:00+05:30"
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

const video = document.getElementById("video");
const audio = document.getElementById("audio");
const overlay = document.getElementById("overlay");
const openBtn = document.getElementById("openBtn");
const mapBtn = document.getElementById("mapBtn");
const calendarBtn = document.getElementById("calendarBtn");
const soundToggle = document.getElementById("soundToggle");

/* =========================
   SET CONTENT
   ========================= */

openBtn.textContent = `Tap to Open ${data.title} ✨`;

video.src = data.video;
video.poster = data.poster;
video.muted = true;
video.playsInline = true;

audio.src = data.audio;
mapBtn.href = data.map;

let soundOn = true;

/* =========================
   AMBIENT COUNTDOWN (BACKGROUND HUD)
   ========================= */

const countdown = document.createElement("div");
countdown.className = "countdown-ambient";
document.body.appendChild(countdown);

const eventTime = new Date(data.startDate).getTime();

function updateCountdown() {
  const now = Date.now();
  const diff = eventTime - now;

  if (diff <= 0) {
    countdown.style.display = "none";
    clearInterval(timer);
    return;
  }

  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);

  countdown.innerHTML = `
    ${d > 0 ? `${d}d&nbsp;` : ""}
    ${String(h).padStart(2, "0")} :
    ${String(m).padStart(2, "0")} :
    ${String(s).padStart(2, "0")}
  `;
}

const timer = setInterval(updateCountdown, 1000);
updateCountdown();

/* =========================
   CALENDAR (.ics)
   ========================= */

calendarBtn.addEventListener("click", () => {
  const start = new Date(data.startDate);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

  const fmt = d =>
    d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const ics = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${data.calendarTitle}
DTSTART:${fmt(start)}
DTEND:${fmt(end)}
LOCATION:${data.map}
DESCRIPTION:${data.title}
END:VEVENT
END:VCALENDAR
`;

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${data.title}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});

/* =========================
   PLAY CONTROL
   ========================= */

function startInvite() {
  overlay.style.display = "none";
  video.muted = false;
  video.play().catch(() => {});
  audio.play().catch(() => {});
}

if (isIOS) {
  openBtn.addEventListener("click", startInvite, { once: true });
} else {
  overlay.style.display = "none";
  setTimeout(startInvite, 300);
}

/* =========================
   SOUND TOGGLE
   ========================= */

soundToggle.addEventListener("click", () => {
  soundOn = !soundOn;
  audio.muted = !soundOn;
  soundToggle.textContent = soundOn ? "🔊" : "🔇";
});
