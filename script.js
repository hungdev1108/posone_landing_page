// Custom JavaScript for POS ONE Landing Page

document.addEventListener("DOMContentLoaded", function () {
  // Initialize AOS (Animate On Scroll)
  AOS.init({
    duration: 1000,
    easing: "ease-in-out",
    once: true,
    mirror: false,
  });

  // Navbar scroll effect
  const navbar = document.getElementById("mainNav");

  function updateNavbar() {
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  // Performance optimized helpers
  const rafThrottle = (fn) => {
    let ticking = false;
    return (...args) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          fn(...args);
          ticking = false;
        });
        ticking = true;
      }
    };
  };

  // Replace scroll listeners with throttled versions
  window.addEventListener("scroll", rafThrottle(updateNavbar));

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.offsetTop;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Scroll to top button
  const scrollTopBtn = document.getElementById("scrollTop");

  function toggleScrollTopBtn() {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add("show");
    } else {
      scrollTopBtn.classList.remove("show");
    }
  }

  window.addEventListener("scroll", rafThrottle(toggleScrollTopBtn));

  scrollTopBtn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // Active navigation link highlighting
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

  function highlightActiveNav() {
    const scrollPos = window.scrollY + 100;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", rafThrottle(highlightActiveNav));

  // Mobile menu close on link click
  const navbarToggler = document.querySelector(".navbar-toggler");
  const navbarCollapse = document.querySelector(".navbar-collapse");

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navbarCollapse.classList.contains("show")) {
        navbarToggler.click();
      }
    });
  });

  // Register modal functionality
  const registerBtns = document.querySelectorAll('a[href="#register"]');
  const registerModal = new bootstrap.Modal(
    document.getElementById("registerModal")
  );

  registerBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      registerModal.show();
    });
  });

  // Registration form handling
  const registerForm = document.getElementById("registerForm");

  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Show success message
    Swal.fire({
      title: "Đăng ký thành công!",
      text: "Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.",
      icon: "success",
      confirmButtonText: "OK",
      confirmButtonColor: "#2c5aa0",
    }).then(() => {
      registerModal.hide();
      registerForm.reset();
    });
  });

  // Contact form handling
  const contactForm = document.getElementById("contactForm");

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Show success message
    Swal.fire({
      title: "Gửi tin nhắn thành công!",
      text: "Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể.",
      icon: "success",
      confirmButtonText: "OK",
      confirmButtonColor: "#2c5aa0",
    }).then(() => {
      contactForm.reset();
    });
  });

  // Feature cards hover effect
  const featureCards = document.querySelectorAll(".feature-card");

  featureCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-10px) scale(1.02)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });

  // Counter animation for statistics
  function animateCounter(element, target, duration = 1800) {
    let start = 0;
    const startTime = performance.now();

    function update(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased =
        progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress;
      const value = Math.floor(eased * target);
      element.textContent = value.toLocaleString("vi-VN");
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target.toLocaleString("vi-VN");
      }
    }

    requestAnimationFrame(update);
  }

  // Intersection Observer for counter animation
  const counters = document.querySelectorAll(".counter");

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.target);
          animateCounter(entry.target, target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => {
    counterObserver.observe(counter);
  });

  // Parallax effect for hero section
  const heroSection = document.querySelector(".hero-section");

  function parallaxEffect() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;

    if (heroSection) {
      heroSection.style.transform = `translateY(${rate}px)`;
    }
  }

  // Parallax only on desktop & reduced-motion off
  const enableParallax =
    window.innerWidth > 992 &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (enableParallax) {
    window.addEventListener("scroll", rafThrottle(parallaxEffect));
  }

  // Typewriter effect for hero title
  function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = "";

    function type() {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }

    type();
  }

  // Apply typewriter effect to hero title
  const heroTitle = document.querySelector(".hero-title");
  if (heroTitle) {
    const originalText = heroTitle.textContent;
    typeWriter(heroTitle, originalText, 50);
  }

  // Floating animation for cards
  function floatingAnimation() {
    const floatingElements = document.querySelectorAll(".floating-card");

    floatingElements.forEach((element, index) => {
      const delay = index * 200;
      setTimeout(() => {
        element.style.animation = "float 3s ease-in-out infinite";
      }, delay);
    });
  }

  // Add float keyframe animation
  const style = document.createElement("style");
  style.textContent = `
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
    `;
  document.head.appendChild(style);

  floatingAnimation();

  // Transition reveal Observer
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          revealObserver.unobserve(e.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  [
    ...document.querySelectorAll(
      ".feature-card,.why-card,.support-card,.benefit-item,.stat-card,.testimonial-item,.offer-item"
    ),
  ].forEach((el) => {
    el.classList.add("reveal");
    revealObserver.observe(el);
  });

  // Drag scroll for testimonial slider
  const slider = document.querySelector(".testimonial-slider");
  if (slider) {
    let isDown = false,
      startX,
      scrollLeft;
    slider.addEventListener("mousedown", (e) => {
      isDown = true;
      slider.classList.add("dragging");
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener("mouseleave", () => {
      isDown = false;
      slider.classList.remove("dragging");
    });
    slider.addEventListener("mouseup", () => {
      isDown = false;
      slider.classList.remove("dragging");
    });
    slider.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.1;
      slider.scrollLeft = scrollLeft - walk;
    });
  }

  // Resize recalculations
  window.addEventListener(
    "resize",
    rafThrottle(() => {
      if (window.innerWidth <= 992) {
        heroSection.style.transform = "none";
      }
    })
  );

  // Loading screen
  function hideLoadingScreen() {
    const loadingScreen = document.querySelector(".loading-screen");
    if (loadingScreen) {
      setTimeout(() => {
        loadingScreen.style.opacity = "0";
        setTimeout(() => {
          loadingScreen.style.display = "none";
        }, 500);
      }, 1000);
    }
  }

  hideLoadingScreen();

  // Form validation
  function setupFormValidation() {
    const forms = document.querySelectorAll("form");

    forms.forEach((form) => {
      const inputs = form.querySelectorAll(
        "input[required], select[required], textarea[required]"
      );

      inputs.forEach((input) => {
        input.addEventListener("blur", function () {
          validateField(this);
        });

        input.addEventListener("input", function () {
          clearError(this);
        });
      });
    });
  }

  function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    let isValid = true;
    let errorMessage = "";

    if (!value) {
      isValid = false;
      errorMessage = "Trường này là bắt buộc";
    } else if (type === "email" && !isValidEmail(value)) {
      isValid = false;
      errorMessage = "Email không hợp lệ";
    } else if (type === "tel" && !isValidPhone(value)) {
      isValid = false;
      errorMessage = "Số điện thoại không hợp lệ";
    }

    if (!isValid) {
      showError(field, errorMessage);
    } else {
      clearError(field);
    }

    return isValid;
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isValidPhone(phone) {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  }

  function showError(field, message) {
    clearError(field);
    field.classList.add("is-invalid");

    const errorDiv = document.createElement("div");
    errorDiv.className = "invalid-feedback";
    errorDiv.textContent = message;

    field.parentNode.appendChild(errorDiv);
  }

  function clearError(field) {
    field.classList.remove("is-invalid");
    const errorDiv = field.parentNode.querySelector(".invalid-feedback");
    if (errorDiv) {
      errorDiv.remove();
    }
  }

  setupFormValidation();

  // Search functionality (if needed)
  function setupSearch() {
    const searchInput = document.querySelector("#searchInput");
    const searchResults = document.querySelector("#searchResults");

    if (searchInput && searchResults) {
      let searchTimeout;

      searchInput.addEventListener("input", function () {
        clearTimeout(searchTimeout);
        const query = this.value.trim();

        if (query.length > 2) {
          searchTimeout = setTimeout(() => {
            performSearch(query);
          }, 300);
        } else {
          searchResults.innerHTML = "";
          searchResults.style.display = "none";
        }
      });
    }
  }

  function performSearch(query) {
    // Implement search functionality here
    console.log("Searching for:", query);
  }

  setupSearch();

  // Cookie consent (if needed)
  function setupCookieConsent() {
    const cookieBanner = document.querySelector(".cookie-banner");
    const acceptBtn = document.querySelector(".accept-cookies");

    if (cookieBanner && acceptBtn) {
      // Check if user has already accepted cookies
      if (!localStorage.getItem("cookiesAccepted")) {
        setTimeout(() => {
          cookieBanner.style.display = "block";
        }, 2000);
      }

      acceptBtn.addEventListener("click", function () {
        localStorage.setItem("cookiesAccepted", "true");
        cookieBanner.style.display = "none";
      });
    }
  }

  setupCookieConsent();

  // Print functionality
  function setupPrint() {
    const printBtns = document.querySelectorAll(".print-btn");

    printBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        window.print();
      });
    });
  }

  setupPrint();

  // Share functionality
  function setupShare() {
    const shareBtns = document.querySelectorAll(".share-btn");

    shareBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        if (navigator.share) {
          navigator.share({
            title: "POS ONE - Giải Pháp Quản Lý Kinh Doanh",
            text: "Phần mềm quản lý nhà hàng toàn diện",
            url: window.location.href,
          });
        } else {
          // Fallback for browsers that don't support Web Share API
          copyToClipboard(window.location.href);
          showNotification("Link đã được sao chép!");
        }
      });
    });
  }

  function copyToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  }

  function showNotification(message) {
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = message;
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  setupShare();

  console.log("POS ONE Landing Page initialized successfully!");
});

// SweetAlert2 CDN (add to head if not already included)
if (!window.Swal) {
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
  document.head.appendChild(script);
}
