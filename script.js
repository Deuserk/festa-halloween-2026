// Contagem até o início previsto da festa.
const targetDate = new Date("2026-10-31T19:00:00-03:00").getTime();

function updateCountdown() {
  const now = Date.now();
  let diff = targetDate - now;

  if (diff <= 0) {
    ["days","hours","minutes","seconds"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.textContent = "00";
    });
    return;
  }

  const days = Math.floor(diff / 86400000);
  diff %= 86400000;
  const hours = Math.floor(diff / 3600000);
  diff %= 3600000;
  const minutes = Math.floor(diff / 60000);
  diff %= 60000;
  const seconds = Math.floor(diff / 1000);

  document.getElementById("days").textContent = String(days).padStart(2,"0");
  document.getElementById("hours").textContent = String(hours).padStart(2,"0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2,"0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2,"0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

// Animações ao rolar.
const revealItems = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .12 });

revealItems.forEach((item) => revealObserver.observe(item));

// Menu mobile.
const menuButton = document.getElementById("menuButton");
const mainNav = document.getElementById("mainNav");

menuButton.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  document.body.classList.toggle("menu-open", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

// Cabeçalho fica um pouco mais sólido depois de rolar.
const header = document.getElementById("siteHeader");
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 50);
}, { passive: true });

// Brasas decorativas leves.
const emberContainer = document.getElementById("embers");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceMotion) {
  for (let i = 0; i < 22; i++) {
    const ember = document.createElement("span");
    ember.className = "ember";
    ember.style.left = `${Math.random() * 100}%`;
    ember.style.animationDuration = `${7 + Math.random() * 9}s`;
    ember.style.animationDelay = `${-Math.random() * 14}s`;
    ember.style.opacity = `${0.15 + Math.random() * 0.35}`;
    emberContainer.appendChild(ember);
  }
}




// Pix Copia e Cola.
const copyPixButton = document.querySelector(".copy-pix-button");
const pixStatus = document.getElementById("pixStatus");

if (copyPixButton) {
  copyPixButton.addEventListener("click", async () => {
    const code = copyPixButton.dataset.pix;

    try {
      await navigator.clipboard.writeText(code);
    } catch (error) {
      const temp = document.createElement("textarea");
      temp.value = code;
      temp.setAttribute("readonly", "");
      temp.style.position = "fixed";
      temp.style.opacity = "0";
      document.body.appendChild(temp);
      temp.select();
      document.execCommand("copy");
      temp.remove();
    }

    copyPixButton.textContent = "CÓDIGO PIX COPIADO ✓";
    pixStatus.textContent = "Abra o app do seu banco e escolha Pix Copia e Cola.";

    setTimeout(() => {
      copyPixButton.textContent = "COPIAR CÓDIGO PIX";
    }, 3500);
  });
}


// Galeria de exemplos do Visual de Terror.
const examplesModal = document.getElementById("examplesModal");
const openExamples = document.getElementById("openExamples");

function closeExamplesGallery() {
  if (!examplesModal) return;
  examplesModal.classList.remove("open");
  examplesModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("examples-open");
}

if (openExamples && examplesModal) {
  openExamples.addEventListener("click", () => {
    examplesModal.classList.add("open");
    examplesModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("examples-open");
  });

  examplesModal.querySelectorAll("[data-close-examples]").forEach((element) => {
    element.addEventListener("click", closeExamplesGallery);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && examplesModal.classList.contains("open")) {
      closeExamplesGallery();
    }
  });
}


// Ampliação das fotos da galeria.
const photoLightbox = document.getElementById("photoLightbox");
const photoLightboxImage = document.getElementById("photoLightboxImage");
const photoLightboxClose = document.querySelector(".photo-lightbox-close");
document.querySelectorAll(".example-photo").forEach((button)=>{button.addEventListener("click",()=>{if(!photoLightbox||!photoLightboxImage)return;photoLightboxImage.src=button.dataset.full;photoLightbox.classList.add("open");photoLightbox.setAttribute("aria-hidden","false")})});
function closePhotoLightbox(){if(!photoLightbox||!photoLightboxImage)return;photoLightbox.classList.remove("open");photoLightbox.setAttribute("aria-hidden","true");photoLightboxImage.src=""}
if(photoLightboxClose)photoLightboxClose.addEventListener("click",closePhotoLightbox);
if(photoLightbox)photoLightbox.addEventListener("click",(event)=>{if(event.target===photoLightbox)closePhotoLightbox()});
document.addEventListener("keydown",(event)=>{if(event.key==="Escape"&&photoLightbox?.classList.contains("open"))closePhotoLightbox()});


// Exemplos de músicas / playlist.
const musicExamplesModal = document.getElementById("musicExamplesModal");
const openMusicExamples = document.getElementById("openMusicExamples");
const musicPlayerCards = Array.from(document.querySelectorAll(".music-player-card"));

function formatMusicTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

function setupMusicPlayer(card) {
  const audio = card.querySelector(".music-preview-audio");
  const playButton = card.querySelector(".music-play");
  const restartButton = card.querySelector(".music-restart");
  const seek = card.querySelector(".music-seek");
  const currentTime = card.querySelector(".music-current-time");
  const duration = card.querySelector(".music-duration");
  const trackLabel = card.dataset.trackLabel || "música";

  if (!audio || !playButton) return null;

  function updateButton() {
    const playing = !audio.paused;
    playButton.textContent = playing ? "❚❚" : "▶";
    playButton.classList.toggle("is-playing", playing);
    playButton.setAttribute(
      "aria-label",
      playing ? `Pausar ${trackLabel}` : `Reproduzir ${trackLabel}`
    );
  }

  playButton.addEventListener("click", async () => {
    if (audio.paused) {
      musicPlayerCards.forEach((otherCard) => {
        if (otherCard === card) return;
        const otherAudio = otherCard.querySelector(".music-preview-audio");
        if (otherAudio && !otherAudio.paused) otherAudio.pause();
      });
      try {
        await audio.play();
      } catch (error) {
        return;
      }
    } else {
      audio.pause();
    }
    updateButton();
  });

  if (restartButton) {
    restartButton.addEventListener("click", async () => {
      musicPlayerCards.forEach((otherCard) => {
        if (otherCard === card) return;
        const otherAudio = otherCard.querySelector(".music-preview-audio");
        if (otherAudio && !otherAudio.paused) otherAudio.pause();
      });
      audio.currentTime = 0;
      try {
        await audio.play();
      } catch (error) {}
      updateButton();
    });
  }

  audio.addEventListener("loadedmetadata", () => {
    if (duration) duration.textContent = formatMusicTime(audio.duration);
  });

  audio.addEventListener("timeupdate", () => {
    if (currentTime) currentTime.textContent = formatMusicTime(audio.currentTime);
    if (seek && Number.isFinite(audio.duration) && audio.duration > 0) {
      seek.value = (audio.currentTime / audio.duration) * 100;
    }
  });

  audio.addEventListener("play", updateButton);
  audio.addEventListener("pause", updateButton);
  audio.addEventListener("ended", updateButton);

  if (seek) {
    seek.addEventListener("input", () => {
      if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
      audio.currentTime = (Number(seek.value) / 100) * audio.duration;
    });
  }

  updateButton();
  return { audio, updateButton };
}

const musicPlayers = musicPlayerCards.map(setupMusicPlayer).filter(Boolean);

function closeMusicExamples() {
  if (!musicExamplesModal) return;
  musicExamplesModal.classList.remove("open");
  musicExamplesModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("music-examples-open");

  musicPlayers.forEach(({ audio, updateButton }) => {
    if (!audio.paused) audio.pause();
    updateButton();
  });
}

if (openMusicExamples && musicExamplesModal) {
  openMusicExamples.addEventListener("click", () => {
    musicExamplesModal.classList.add("open");
    musicExamplesModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("music-examples-open");
  });

  musicExamplesModal.querySelectorAll("[data-close-music]").forEach((element) => {
    element.addEventListener("click", closeMusicExamples);
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && musicExamplesModal?.classList.contains("open")) {
    closeMusicExamples();
  }
});
