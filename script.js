/* =========================================================
   script.js – Page interactivity
   (Assignment 2 features + navigation for Assignment 3)
     1. Welcome message on page load
     2. Dark / Light mode toggle
     3. Show / Hide sections
     4. Dynamic skills list
     5. Interactive project details
     6. Contact form with validation
     7. Mobile menu + active nav link
   API code lives in api.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  showWelcomeMessage();
  setupThemeToggle();
  setupSectionToggles();
  setupSkillAdder();
  setupProjectDetails();
  setupContactForm();
  setupNavigation();
});

/* ---------- 1. Welcome message ---------- */
function showWelcomeMessage() {
  const banner = document.getElementById("welcome-banner");
  if (!banner) return;

  const hour = new Date().getHours();
  let greeting = "Good evening";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 18) greeting = "Good afternoon";

  banner.textContent = greeting + "! Welcome to my portfolio.";
  banner.classList.add("visible");

  // Hide after 4 seconds
  setTimeout(function () {
    banner.classList.remove("visible");
  }, 4000);
}

/* ---------- 2. Dark / Light mode ---------- */
function setupThemeToggle() {
  const button = document.getElementById("theme-toggle");
  if (!button) return;

  // Remember the visitor's choice between visits
  if (getSaved("theme") === "dark") {
    document.body.classList.add("dark");
    button.textContent = "☀️ Light";
  }

  button.addEventListener("click", function () {
    const isDark = document.body.classList.toggle("dark");
    button.textContent = isDark ? "☀️ Light" : "🌙 Dark";
    save("theme", isDark ? "dark" : "light");
  });
}

/* ---------- 3. Show / Hide sections ---------- */
function setupSectionToggles() {
  document.querySelectorAll(".toggle-btn").forEach(function (button) {
    button.addEventListener("click", function () {
      const section = document.getElementById(button.dataset.target);
      if (!section) return;

      const isHidden = section.classList.toggle("hidden");
      button.textContent = (isHidden ? "Show " : "Hide ") + button.dataset.label;
    });
  });
}

/* ---------- 4. Dynamic skills list ---------- */
function setupSkillAdder() {
  const input = document.getElementById("skill-input");
  const addButton = document.getElementById("add-skill-btn");
  const list = document.getElementById("skills-list");
  const message = document.getElementById("skill-message");
  if (!input || !addButton || !list) return;

  function addSkill() {
    const skill = input.value.trim();

    if (skill === "") {
      showMessage(message, "Please type a skill first.", "error");
      return;
    }

    // Block duplicates (case-insensitive)
    const existing = Array.from(list.children).map(function (li) {
      return li.textContent.toLowerCase();
    });
    if (existing.includes(skill.toLowerCase())) {
      showMessage(message, '"' + skill + '" is already listed.', "error");
      return;
    }

    const li = document.createElement("li");
    li.textContent = skill;
    li.classList.add("new-skill");
    list.appendChild(li);

    showMessage(message, '"' + skill + '" added.', "success");
    input.value = "";
    input.focus();
  }

  addButton.addEventListener("click", addSkill);
  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addSkill();
    }
  });
}

/* ---------- 5. Project details ---------- */
function setupProjectDetails() {
  document.querySelectorAll(".details-btn").forEach(function (button) {
    button.addEventListener("click", function () {
      const details = button.closest(".project").querySelector(".project-details");
      if (!details) return;

      const isHidden = details.classList.toggle("hidden");
      button.textContent = isHidden ? "View Details" : "Hide Details";
    });
  });
}

/* ---------- 6. Contact form validation ---------- */
function setupContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");
  const result = document.getElementById("form-message");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // stop page reload

    const errors = [];
    [nameInput, emailInput, messageInput].forEach(function (input) {
      input.classList.remove("input-error");
    });

    if (nameInput.value.trim() === "") {
      errors.push("Name is required.");
      nameInput.classList.add("input-error");
    }
    if (emailInput.value.trim() === "") {
      errors.push("Email is required.");
      emailInput.classList.add("input-error");
    } else if (!emailPattern.test(emailInput.value.trim())) {
      errors.push("Please enter a valid email.");
      emailInput.classList.add("input-error");
    }
    if (messageInput.value.trim() === "") {
      errors.push("Message is required.");
      messageInput.classList.add("input-error");
    }

    if (errors.length > 0) {
      showMessage(result, errors.join(" "), "error");
    } else {
      showMessage(result, "Thanks, " + nameInput.value.trim() + "! Your message has been sent.", "success");
      form.reset();
    }
  });
}

/* ---------- 7. Navigation ---------- */
function setupNavigation() {
  const menuButton = document.getElementById("menu-toggle");
  const nav = document.getElementById("nav-links");
  const links = nav.querySelectorAll("a");

  // Open / close the menu on phones
  menuButton.addEventListener("click", function () {
    nav.classList.toggle("open");
  });

  // Close the menu after a link is clicked
  links.forEach(function (link) {
    link.addEventListener("click", function () {
      nav.classList.remove("open");
    });
  });

  // Highlight the link of the section currently on screen
  const sections = ["home", "skills-wrapper", "projects-wrapper", "live", "contact"];
  window.addEventListener("scroll", function () {
    let current = "home";
    sections.forEach(function (id) {
      const section = document.getElementById(id);
      if (section && window.scrollY >= section.offsetTop - 120) current = id;
    });

    links.forEach(function (link) {
      const target = link.getAttribute("href").slice(1);
      link.classList.toggle("active", current.startsWith(target));
    });
  });
}

/* ---------- Helpers ---------- */
function showMessage(element, text, type) {
  if (!element) return;
  element.textContent = text;
  element.className = "form-message " + type;
}

// localStorage can fail in private mode, so wrap it
function save(key, value) {
  try { localStorage.setItem(key, value); } catch (e) { /* ignore */ }
}
function getSaved(key) {
  try { return localStorage.getItem(key); } catch (e) { return null; }
}
