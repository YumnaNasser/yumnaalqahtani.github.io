/* =========================================================
   api.js – External API integration (Assignment 3)
   All APIs below are free and need NO API key.
     1. Weather  – Open-Meteo (geocoding + forecast)
     2. Quotes   – DummyJSON
     3. GitHub   – GitHub REST API (public repos)
   Each one shows a loading state, handles errors,
   and updates the page (DOM) with the data.
   ========================================================= */

// >>> Put your GitHub username here <<<
const GITHUB_USERNAME = "yumnanasser";

document.addEventListener("DOMContentLoaded", function () {
  // Weather: load Cairo first, then search on submit
  getWeather("Cairo");
  document.getElementById("weather-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const city = document.getElementById("city-input").value.trim();
    if (city) getWeather(city);
  });

  // Quotes: load one now, new one on button click
  getQuote();
  document.getElementById("new-quote-btn").addEventListener("click", getQuote);

  // GitHub repositories
  getRepos(GITHUB_USERNAME);
});

/* ---------- Shared helper: fetch JSON with error checking ---------- */
async function fetchJSON(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Request failed (status " + response.status + ")");
  }
  return response.json();
}

/* ---------- Helper: show a loading or error line ---------- */
function setStatus(container, text, isError) {
  container.innerHTML = "";
  const p = document.createElement("p");
  p.className = isError ? "status error" : "status";
  p.textContent = text;
  container.appendChild(p);
}

/* =========================================================
   1. WEATHER – Open-Meteo
   Step 1: turn the city name into coordinates (geocoding)
   Step 2: get the current weather for those coordinates
   ========================================================= */
async function getWeather(city) {
  const box = document.getElementById("weather-result");
  setStatus(box, "Loading weather for " + city + "…");

  try {
    // Step 1 – find the city
    const geo = await fetchJSON(
      "https://geocoding-api.open-meteo.com/v1/search?count=1&name=" + encodeURIComponent(city)
    );
    if (!geo.results || geo.results.length === 0) {
      setStatus(box, 'City "' + city + '" not found. Try another name.', true);
      return;
    }
    const place = geo.results[0];

    // Step 2 – current weather
    const data = await fetchJSON(
      "https://api.open-meteo.com/v1/forecast?latitude=" + place.latitude +
      "&longitude=" + place.longitude +
      "&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code"
    );
    const now = data.current;
    const condition = describeWeather(now.weather_code);

    // Update the DOM
    box.innerHTML = `
      <div class="weather-main">
        <span class="weather-icon">${condition.icon}</span>
        <div>
          <div class="weather-temp">${Math.round(now.temperature_2m)}°C</div>
          <div>${condition.text}</div>
        </div>
      </div>
      <p class="weather-meta">
        ${place.name}, ${place.country || ""} ·
        Humidity ${now.relative_humidity_2m}% ·
        Wind ${Math.round(now.wind_speed_10m)} km/h
      </p>`;
  } catch (error) {
    setStatus(box, "Couldn't load the weather. Please check your connection and try again.", true);
    console.error("Weather error:", error);
  }
}

// Open-Meteo returns a number code; turn it into text + icon
function describeWeather(code) {
  if (code === 0) return { text: "Clear sky", icon: "☀️" };
  if (code <= 2) return { text: "Partly cloudy", icon: "⛅" };
  if (code === 3) return { text: "Overcast", icon: "☁️" };
  if (code <= 48) return { text: "Fog", icon: "🌫️" };
  if (code <= 57) return { text: "Drizzle", icon: "🌦️" };
  if (code <= 67) return { text: "Rain", icon: "🌧️" };
  if (code <= 77) return { text: "Snow", icon: "❄️" };
  if (code <= 82) return { text: "Rain showers", icon: "🌧️" };
  if (code <= 86) return { text: "Snow showers", icon: "🌨️" };
  return { text: "Thunderstorm", icon: "⛈️" };
}

/* =========================================================
   2. QUOTES – DummyJSON
   ========================================================= */
async function getQuote() {
  const box = document.getElementById("quote-box");
  const button = document.getElementById("new-quote-btn");

  setStatus(box, "Loading…");
  button.disabled = true; // stop double clicks while loading

  try {
    const data = await fetchJSON("https://dummyjson.com/quotes/random");

    box.innerHTML = "";
    const text = document.createElement("p");
    text.className = "quote-text";
    text.textContent = "“" + data.quote + "”";

    const author = document.createElement("p");
    author.className = "quote-author";
    author.textContent = "— " + data.author;

    box.append(text, author);
  } catch (error) {
    setStatus(box, "Couldn't load a quote. Please try again.", true);
    console.error("Quote error:", error);
  } finally {
    button.disabled = false;
  }
}

/* =========================================================
   3. GITHUB – public repositories
   ========================================================= */
async function getRepos(username) {
  const box = document.getElementById("github-repos");

  if (!username) {
    setStatus(box, "Add your GitHub username in api.js to show your repositories.", true);
    return;
  }

  setStatus(box, "Loading repositories…");

  try {
    const repos = await fetchJSON(
      "https://api.github.com/users/" + encodeURIComponent(username) + "/repos?sort=updated&per_page=6"
    );

    if (repos.length === 0) {
      setStatus(box, "No public repositories yet.");
      return;
    }

    box.innerHTML = "";
    repos.forEach(function (repo) {
      const card = document.createElement("article");
      card.className = "card repo";
      card.innerHTML = `
        <h3><a href="${repo.html_url}" target="_blank" rel="noopener"></a></h3>
        <p></p>
        <div class="repo-meta">
          <span>⭐ ${repo.stargazers_count}</span>
          <span>💻 </span>
        </div>`;

      // Use textContent for text from the API (safer than innerHTML)
      card.querySelector("a").textContent = repo.name;
      card.querySelector("p").textContent = repo.description || "No description provided.";
      card.querySelector(".repo-meta span:last-child").textContent += repo.language || "N/A";

      box.appendChild(card);
    });
  } catch (error) {
    setStatus(box, "Couldn't load GitHub repositories. Check the username or try again later.", true);
    console.error("GitHub error:", error);
  }
}
