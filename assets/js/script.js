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

    // === Contact Form Submission ===
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      formStatus.textContent = "Sending...";

      const formData = {
        name: contactForm.name.value.trim(),
        email: contactForm.email.value.trim(),
        message: contactForm.message.value.trim(),
      };

      try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbxvJIZMBZ31p16jxyZ8QSUq24QbhXMlB18A124ltGye-yu5P0ssYDGeXHn-pxQrag_Mug/exec", {
          method: "POST",
          body: JSON.stringify(formData),
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          formStatus.textContent = "Message sent successfully!";
          contactForm.reset();
        } else {
          formStatus.textContent = "Failed to send. Please try again.";
        }
      } catch (err) {
        formStatus.textContent = "Something went wrong!";
        console.error("Form submission error:", err);
      }
    });
  }
});

  // === Animate on Scroll ===
  const fadeElements = document.querySelectorAll('.fade-up, .fade-in, .fade-section');
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

  // === ScrollSpy (Active Link Highlight) ===
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll("nav a[href^='#']");

  const highlightCurrentSection = () => {
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
  };

  window.addEventListener("scroll", highlightCurrentSection);

  // === Mobile Menu Toggle ===
  const hamburger = document.getElementById("hamburger");
  const navLinksContainer = document.getElementById("nav-links");

  if (hamburger && navLinksContainer) {
    hamburger.addEventListener("click", () => {
      navLinksContainer.classList.toggle("show");
    });
  };
