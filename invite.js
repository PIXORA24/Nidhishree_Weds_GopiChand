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

/* =========================
   ROYAL TRADITIONAL COUNTDOWN
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

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  countdown.innerHTML = `
    <div>
      <span>${days}</span>
      <small>Days</small>
    </div>
    <div>
      <span>${String(hours).padStart(2, "0")}</span>
      <small>Hours</small>
    </div>
    <div>
      <span>${String(minutes).padStart(2, "0")}</span>
      <small>Minutes</small>
    </div>
    <div>
      <span>${String(seconds).padStart(2, "0")}</span>
      <small>Seconds</small>
    </div>
  `;
}

const timer = setInterval(updateCountdown, 1000);
updateCountdown();

/* =========================
   CALENDAR DOWNLOAD
   ========================= */

calendarBtn.addEventListener("click", () => {
  const start = new Date(data.startDate);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

  const formatICS = date =>
    date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${data.calendarTitle}
DTSTART:${formatICS(start)}
DTEND:${formatICS(end)}
LOCATION:${data.venue}
DESCRIPTION:${data.title}
END:VEVENT
END:VCALENDAR
  `;

  const blob = new Blob([icsContent], {
    type: "text/calendar;charset=utf-8"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${data.title}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

/* =========================
   START INVITE
   ========================= */

function startInvite() {
  overlay.style.display = "none";
  video.muted = false;
  video.play().catch(() => {});
  audio.play().catch(() => {});
}

openBtn.addEventListener("click", startInvite, { once: true });

/* =========================
   SOUND TOGGLE
   ========================= */

soundToggle.addEventListener("click", () => {
  soundOn = !soundOn;
  audio.muted = !soundOn;
  soundToggle.textContent = soundOn ? "🔊" : "🔇";
});
