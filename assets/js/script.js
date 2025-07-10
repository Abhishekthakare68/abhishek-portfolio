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

// === Throttle Utility ===
function throttle(fn, delay) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}

document.addEventListener("DOMContentLoaded", () => {

  // === Animate on Scroll ===
  document.querySelectorAll('.fade-up, .fade-in')
    .forEach(el => revealOnScroll.observe(el));

  // === Smooth Scroll for Anchor Links ===
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", function (e) {
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
      const top = section.offsetTop - 100;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove("active");
          if (link.getAttribute("href").includes(id)) {
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

    // Auto-close on nav link click (mobile)
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          navLinksContainer.classList.remove("show");
        }
      });
    });
  }

  // === Contact Form Submission ===
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

      const iframe = document.createElement("iframe");
      iframe.name = "hidden-iframe";
      iframe.style.display = "none";
      document.body.appendChild(iframe);

      const hiddenForm = document.createElement("form");
      hiddenForm.action = "https://script.google.com/macros/s/AKfycbyOArDBMKWTbUwPzzuEeFUBuqmvIel_7AkgZkuFNclsQWqr1BSzARnzwIt78yFAYFvi7Q/exec";
      hiddenForm.method = "POST";
      hiddenForm.target = "hidden-iframe";

      ["name", "email", "message"].forEach(field => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = field;
        input.value = contactForm[field].value.trim();
        hiddenForm.appendChild(input);
      });

      document.body.appendChild(hiddenForm);
      hiddenForm.submit();

      setTimeout(() => {
        formStatus.textContent = "Message sent successfully!";
        formStatus.style.color = "green";
        contactForm.reset();
        submitButton.disabled = false;

        document.body.removeChild(iframe);
        document.body.removeChild(hiddenForm);
      }, 2000);
    });
  }

  // === Typewriter Effect ===
  const typewriterSpan = document.getElementById("typewriter");
  const phrases = ["Full Stack Developer", "ML Engineer", "Tech Enthusiast"];
  let i = 0, j = 0, isDeleting = false;

  function type() {
    if (!typewriterSpan) return;

    typewriterSpan.textContent = phrases[i].substring(0, j);

    if (!isDeleting) {
      if (j < phrases[i].length) {
        j++;
      } else {
        isDeleting = true;
        setTimeout(type, 1500); return;
      }
    } else {
      if (j > 0) {
        j--;
      } else {
        isDeleting = false;
        i = (i + 1) % phrases.length;
      }
    }

    setTimeout(type, isDeleting ? 50 : 100);
  }

  type();
});
