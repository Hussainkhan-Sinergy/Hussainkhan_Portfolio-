// Mobile navigation
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

function closeMenu() {
  if (!menuToggle || !mobileMenu) return;
  mobileMenu.classList.remove("active");
  menuToggle.classList.remove("active");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
}

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("active");
    menuToggle.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  mobileMenu.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));

  document.addEventListener("click", event => {
    if (!mobileMenu.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMenu();
  });
}

// Typewriter
const words = ["Web developer", "Graphic Designer", "Frontend Web Developer", "Content Writer", "Solar Structure Designer", "Product ads creater"];
const typing = document.getElementById("typing");
let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function typeEffect() {
  if (!typing) return;
  const word = words[wordIndex];
  typing.textContent = word.slice(0, charIndex);

  if (!deleting) {
    charIndex++;
    if (charIndex > word.length) {
      deleting = true;
      setTimeout(typeEffect, 1400);
      return;
    }
  } else {
    charIndex--;
    if (charIndex < 0) {
      deleting = false;
      charIndex = 0;
      wordIndex = (wordIndex + 1) % words.length;
    }
  }
  setTimeout(typeEffect, deleting ? 60 : 110);
}
typeEffect();

// Skills animation
const skillsSection = document.getElementById("skills");
const skillBars = document.querySelectorAll(".skills-section .fill");
const skillWidths = { html: "95%", css: "92%", js: "90%", design: "93%", solar: "100%" };

function animateSkills() {
  skillBars.forEach(bar => {
    const key = [...bar.classList].find(className => skillWidths[className]);
    if (key) bar.style.width = skillWidths[key];
  });
}

if (skillsSection && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      animateSkills();
      observer.disconnect();
    }
  }, { threshold: 0.25 });
  observer.observe(skillsSection);
} else {
  animateSkills();
}

// Testimonials
const slides = [...document.querySelectorAll(".testimonial-section .slide")];
const dots = [...document.querySelectorAll(".testimonial-section .dot")];
let currentSlide = 0;
let testimonialTimer;

function showSlide(index) {
  if (!slides.length) return;
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => slide.classList.toggle("active", i === currentSlide));
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === currentSlide);
    dot.setAttribute("aria-current", i === currentSlide ? "true" : "false");
  });
}

function startTestimonialSlider() {
  clearInterval(testimonialTimer);
  if (slides.length > 1) testimonialTimer = setInterval(() => showSlide(currentSlide + 1), 5000);
}

dots.forEach((dot, index) => dot.addEventListener("click", () => {
  showSlide(index);
  startTestimonialSlider();
}));

showSlide(0);
startTestimonialSlider();

// Active nav link
const navLinks = [...document.querySelectorAll(".nav-menu a")];
const sections = [...document.querySelectorAll("section[id]")];

function updateActiveNav() {
  const position = window.scrollY + 180;
  let current = "about";
  sections.forEach(section => {
    if (position >= section.offsetTop) current = section.id;
  });
  navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${current}`));
}
window.addEventListener("scroll", updateActiveNav, { passive: true });
updateActiveNav();

// Contact form: create a mailto message for static hosting (GitHub Pages included).
const contactForm = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");

if (contactForm) {
  contactForm.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const subject = String(data.get("subject") || "Portfolio enquiry").trim();
    const message = String(data.get("message") || "").trim();
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    window.location.href = `mailto:hksinergy@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    if (formNote) formNote.textContent = "Your email app should open with the message prepared.";
  });
}

// Footer year
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();


/* =========================================================
   AUTHENTIC AMBIENT PARTICLES — no external library
   ========================================================= */
(() => {
    const canvas = document.getElementById("ambientCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = () => window.innerWidth < 700;
    let particles = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let running = true;
    let mouse = { x: -1000, y: -1000, active: false };

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const count = mobile() ? 28 : Math.min(62, Math.floor((width * height) / 21000));
        particles = Array.from({ length: Math.max(22, count) }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - .5) * .24,
            vy: (Math.random() - .5) * .24,
            r: Math.random() * 1.7 + .45,
            a: Math.random() * .42 + .18,
            phase: Math.random() * Math.PI * 2
        }));
    }

    function draw(time) {
        if (!running || reduceMotion.matches) return;

        ctx.clearRect(0, 0, width, height);

        const connectionDistance = mobile() ? 105 : 135;

        for (const p of particles) {
            p.x += p.vx;
            p.y += p.vy;
            p.phase += .008;

            if (p.x < -10) p.x = width + 10;
            if (p.x > width + 10) p.x = -10;
            if (p.y < -10) p.y = height + 10;
            if (p.y > height + 10) p.y = -10;

            const pulse = .82 + Math.sin(p.phase) * .18;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r * pulse, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(45, 255, 190, ${p.a * pulse})`;
            ctx.fill();
        }

        for (let i = 0; i < particles.length; i++) {
            const a = particles[i];
            for (let j = i + 1; j < particles.length; j++) {
                const b = particles[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.hypot(dx, dy);

                if (dist < connectionDistance) {
                    const alpha = (1 - dist / connectionDistance) * .075;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle = `rgba(0, 235, 180, ${alpha})`;
                    ctx.lineWidth = .7;
                    ctx.stroke();
                }
            }
        }

        if (mouse.active && !mobile()) {
            for (const p of particles) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.hypot(dx, dy);
                if (dist < 145) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(50, 255, 205, ${(1 - dist / 145) * .11})`;
                    ctx.lineWidth = .8;
                    ctx.stroke();
                }
            }
        }

        raf = requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
    }, { passive: true });
    window.addEventListener("pointerleave", () => mouse.active = false, { passive: true });

    document.addEventListener("visibilitychange", () => {
        running = !document.hidden;
        if (running && !reduceMotion.matches && !raf) raf = requestAnimationFrame(draw);
        if (!running && raf) {
            cancelAnimationFrame(raf);
            raf = 0;
        }
    });

    reduceMotion.addEventListener?.("change", () => {
        if (reduceMotion.matches) {
            cancelAnimationFrame(raf);
            raf = 0;
            ctx.clearRect(0, 0, width, height);
        } else if (running && !raf) {
            raf = requestAnimationFrame(draw);
        }
    });

    resize();
    if (!reduceMotion.matches) raf = requestAnimationFrame(draw);
})();
