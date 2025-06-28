// === Scroll Reveal Animation ===
const revealOptions = {
  threshold: 0.15,
  rootMargin: "0px 0px -50px 0px"
};

const revealOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, revealOptions);

// === DOM Ready ===
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");
  const backToTopBtn = document.getElementById("back-to-top");
  const themeToggle = document.getElementById("theme-toggle");
  const hamburger = document.getElementById("hamburger");
  const navLinksContainer = document.querySelector(".nav-links");
  const navLinks = document.querySelectorAll("nav a[href^='#']");

  // === Contact Form Submission ===
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const message = contactForm.message.value.trim();

      if (!emailPattern.test(email)) {
        formStatus.textContent = "Please enter a valid email address.";
        formStatus.style.color = "red";
        return;
      }

      const submitButton = contactForm.querySelector("button");
      submitButton.disabled = true;
      formStatus.textContent = "Sending...";
      formStatus.style.color = "#444";

      try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbxvJIZMBZ31p16jxyZ8QSUq24QbhXMlB18A124ltGye-yu5P0ssYDGeXHn-pxQrag_Mug/exec", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, message })
        });

        if (response.ok) {
          formStatus.textContent = "Message sent successfully!";
          formStatus.style.color = "green";
          contactForm.reset();
        } else {
          formStatus.textContent = "Failed to send. Please try again.";
          formStatus.style.color = "red";
        }
      } catch (err) {
        formStatus.textContent = "Something went wrong!";
        formStatus.style.color = "red";
        console.error("Form error:", err);
      } finally {
        submitButton.disabled = false;
      }
    });
  }

  // === Animate on Scroll ===
  document.querySelectorAll('.fade-up, .fade-in, .fade-section')
    .forEach(el => revealOnScroll.observe(el));

  // === Smooth Anchor Scrolling ===
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute("href").slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // === ScrollSpy (active nav highlighting) ===
  const sections = document.querySelectorAll("section[id]");
  window.addEventListener("scroll", () => {
    const scrollY = window.pageYOffset;
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.toggle("active", link.getAttribute("href").includes(id));
        });
      }
    });
  });

  // === Mobile Menu Toggle ===
  if (hamburger && navLinksContainer) {
    hamburger.addEventListener("click", () => {
      navLinksContainer.classList.toggle("show");
    });

    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
          navLinksContainer.classList.remove("show");
        }
      });
    });
  }

  // === Dark Mode ===
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
    });

    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark");
    }
  }

  // === Typewriter Effect ===
  const phrases = ["Full Stack Developer", "ML Engineer", "Tech Enthusiast"];
  const typewriterSpan = document.getElementById("typewriter");
  let phraseIndex = 0, charIndex = 0, isDeleting = false;

  function typeEffect() {
    if (!typewriterSpan) return;
    const current = phrases[phraseIndex];
    typewriterSpan.textContent = current.substring(0, charIndex);

    if (!isDeleting && charIndex < current.length) {
      charIndex++;
    } else if (isDeleting && charIndex > 0) {
      charIndex--;
    } else {
      isDeleting = !isDeleting;
      if (!isDeleting) phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(typeEffect, 1000);
      return;
    }

    setTimeout(typeEffect, isDeleting ? 60 : 120);
  }
  typeEffect();

  // === Back to Top Button ===
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopBtn.style.display = "block";
    } else {
      backToTopBtn.style.display = "none";
    }
  });

  backToTopBtn?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
