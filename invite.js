const events = {
  wedding: {
    title: "Wedding",
    video: "assets/wedding/video.mp4",
    audio: "assets/wedding/music.mp3",
    poster: "assets/wedding/bg.webp",
    map: "https://maps.app.goo.gl/DAjFK9mZemfoM4b2A",
    calendarTitle: "Nidhishree & Gopi Chand Wedding",
    startDate: "2026-04-02T11:00:00+05:30",
    venue: "Vanitha Achuth Pai Convention Centre, Konchady, Mangaluru"
  },

  sangeet: {
    title: "Sangeet",
    video: "assets/sangeet/video.mp4",
    audio: "assets/sangeet/music.mp3",
    poster: "assets/sangeet/bg.webp",
    map: "https://maps.app.goo.gl/p8KNRLoWdHNpgYwCA",
    calendarTitle: "Nidhishree & Gopi Chand Sangeet",
    startDate: "2026-03-29T18:30:00+05:30",
    venue: "Near Kadri Park, Vasanth Vihar, Mangaluru"
  }
};

const params = new URLSearchParams(window.location.search);
const eventKey = params.get("event");

if (!events[eventKey]) {
  window.location.href = "index.html";
}

const data = events[eventKey];

const video = document.getElementById("video");
const audio = document.getElementById("audio");
const overlay = document.getElementById("overlay");
const openBtn = document.getElementById("openBtn");
const mapBtn = document.getElementById("mapBtn");
const calendarBtn = document.getElementById("calendarBtn");
const soundToggle = document.getElementById("soundToggle");

openBtn.textContent = "Tap to Open Invite ✨";

video.src = data.video;
video.poster = data.poster;
video.muted = true;
video.playsInline = true;

audio.src = data.audio;
mapBtn.href = data.map;

let soundOn = true;

/* Countdown */

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

/* Calendar */

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
LOCATION:${data.venue}
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

/* Start */

function startInvite() {
  overlay.style.display = "none";
  video.muted = false;
  video.play().catch(() => {});
  audio.play().catch(() => {});
}

openBtn.addEventListener("click", startInvite, { once: true });

/* Sound Toggle */

soundToggle.addEventListener("click", () => {
  soundOn = !soundOn;
  audio.muted = !soundOn;
  soundToggle.textContent = soundOn ? "🔊" : "🔇";
});
