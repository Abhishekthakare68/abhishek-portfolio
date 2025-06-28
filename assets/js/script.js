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

// === Throttle Scroll Events ===
function throttle(fn, delay) {
  let lastCall = 0;
  return function (...args) {
    const now = new Date().getTime();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}

document.addEventListener("DOMContentLoaded", () => {
  // === Animate on Scroll ===
  const fadeElements = document.querySelectorAll('.fade-up, .fade-in');
  fadeElements.forEach(el => revealOnScroll.observe(el));

  // === Smooth Scroll for Anchor Links ===
  const scrollLinks = document.querySelectorAll('a[href^="#"]');
  scrollLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute("href").substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // === ScrollSpy ===
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll("nav a[href^='#']");
  window.addEventListener("scroll", throttle(() => {
    const scrollY = window.pageYOffset;
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove("active");
          if (link.getAttribute("href").includes(sectionId)) {
            link.classList.add("active");
          }
        });
      }
    });
  }, 100));

  // === Mobile Menu Toggle ===
  const hamburger = document.getElementById("hamburger");
  const navLinksContainer = document.querySelector(".nav-links");
  if (hamburger && navLinksContainer) {
    hamburger.addEventListener("click", () => {
      navLinksContainer.classList.toggle("show");
    });
  }

  // Auto-close on nav link click
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        navLinksContainer.classList.remove("show");
      }
    });
  });

  // === Contact Form Submission (GET method to avoid CORS) ===
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const message = contactForm.message.value.trim();

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
const response = await fetch("https://script.google.com/macros/s/AKfycbwSL_fpYjJkiEmAGHJZqeJdckxVqR8S1V20uExdb-KnQn2jekEbByfVvxJ6IcYFKQ/exec", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ name, email, message })
});




        const result = await response.json();

        if (result.result === "success") {
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
      }

      setTimeout(() => {
        submitButton.disabled = false;
      }, 1000);
    });
  }

  // === Dark Mode Toggle ===
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.documentElement.classList.toggle("dark");
      localStorage.setItem("theme", document.documentElement.classList.contains("dark") ? "dark" : "light");
    });

    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
    }
  }

  // === Typewriter Effect ===
  const typewriterPhrases = [
    "Full Stack Developer",
    "ML Engineer",
    "Tech Enthusiast"
  ];
  const typewriterSpan = document.getElementById("typewriter");
  let typeIndex = 0, charIndex = 0, isDeleting = false;

  function type() {
    if (!typewriterSpan) return;
    const current = typewriterPhrases[typeIndex];
    const visibleText = current.substring(0, charIndex);
    typewriterSpan.textContent = visibleText;

    if (!isDeleting) {
      if (charIndex < current.length) {
        charIndex++;
      } else {
        isDeleting = true;
        setTimeout(type, 1500); return;
      }
    } else {
      if (charIndex > 0) {
        charIndex--;
      } else {
        isDeleting = false;
        typeIndex = (typeIndex + 1) % typewriterPhrases.length;
      }
    }
    setTimeout(type, isDeleting ? 50 : 100);
  }
  type();

  // === Back to Top ===
  const backToTopBtn = document.getElementById("back-to-top");
  window.addEventListener("scroll", throttle(() => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add("show");
    } else {
      backToTopBtn.classList.remove("show");
    }
  }, 100));

  backToTopBtn?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
