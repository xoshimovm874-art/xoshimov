
"use strict";

// Mobil menyu
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Menyuni yopish" : "Menyuni ochish"
  );
  menuToggle.textContent = isOpen ? "✕" : "☰";
});

// Menyu havolasini bosganda mobil menyu yopiladi
document.querySelectorAll("#navLinks a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Menyuni ochish");
    menuToggle.textContent = "☰";
  });
});

// Sahifani aylantirganda elementlar animatsiya bilan ko‘rinadi
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}

// Faol bo‘limni navigatsiyada ajratib ko‘rsatish
const sections = document.querySelectorAll("main section[id]");
const navItems = document.querySelectorAll("#navLinks a");

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navItems.forEach((link) => {
          const active = link.getAttribute("href") === "#" + entry.target.id;

          if (active) {
            link.classList.add("active");
            link.setAttribute("aria-current", "location");
          } else {
            link.classList.remove("active");
            link.removeAttribute("aria-current");
          }
        });
      }
    });
  }, {
    rootMargin: "-25% 0px -60% 0px"
  });

  sections.forEach((section) => sectionObserver.observe(section));
}

// Footer yilini avtomatik yangilash
document.getElementById("year").textContent = new Date().getFullYear();

// Aloqa formasi: xabarni tayyorlash va nusxalash
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!contactForm.reportValidity()) return;

  const formData = new FormData(contactForm);
  const name = String(formData.get("name")).trim();
  const email = String(formData.get("email")).trim();
  const message = String(formData.get("message")).trim();

  const text =
    `Ism: ${name}\n` +
    `Email: ${email}\n\n` +
    `Xabar:\n${message}`;

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      formStatus.textContent =
        "Xabar nusxalandi! Uni email yoki messenjer orqali yuborishing mumkin.";
    } else {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();

      const copied = document.execCommand("copy");
      area.remove();

      if (copied) {
        formStatus.textContent =
          "Xabar nusxalandi! Endi uni kerakli joyga joylashtir.";
      } else {
        formStatus.textContent =
          "Nusxalash amalga oshmadi. Ma'lumotlarni qo‘lda nusxala.";
      }
    }
  } catch {
    formStatus.textContent =
      "Nusxalash amalga oshmadi. Ma'lumotlarni qo‘lda nusxala.";
  }
});

/* Matrix / hacker fon animatsiyasi */
const canvas = document.getElementById("matrixCanvas");
const ctx = canvas.getContext("2d");
const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

let columns = [];
let fontSize = 14;
let width = 0;
let height = 0;
let animationId;

function resizeMatrix() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const count = Math.ceil(width / fontSize);
  columns = Array.from(
    { length: count },
    () => Math.random() * (height / fontSize)
  );
}

function drawMatrix() {
  ctx.fillStyle = "rgba(8, 13, 24, 0.12)";
  ctx.fillRect(0, 0, width, height);

  ctx.font = fontSize + "px Consolas, monospace";

  columns.forEach((y, i) => {
    const char = Math.random() > 0.5 ? "1" : "0";
    ctx.fillStyle = i % 3 === 0 ? "#60a5fa" : "#22d3ee";
    ctx.fillText(char, i * fontSize, y * fontSize);

    if (y * fontSize > height && Math.random() > 0.975) {
      columns[i] = 0;
    } else {
      columns[i] += 0.45;
    }
  });

  animationId = requestAnimationFrame(drawMatrix);
}

function startMatrix() {
  cancelAnimationFrame(animationId);

  if (reducedMotion.matches) {
    ctx.clearRect(0, 0, width, height);
    return;
  }

  resizeMatrix();
  drawMatrix();
}

window.addEventListener("resize", resizeMatrix);
reducedMotion.addEventListener("change", startMatrix);
startMatrix();
