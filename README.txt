Portfolio Website – Assignment 3
Yumna AlQahtani

FILES
- index.html   : single-page portfolio (Home/About, Skills, Projects, Live Data, Contact)
- styles.css   : layout, responsive design, dark mode
- script.js    : interactive features from Assignment 2 + navigation
- api.js       : external API integration
- link.txt     : live website URL

APIS USED (all free, no API key needed)
1. Open-Meteo (https://open-meteo.com)
   - Geocoding API turns a city name into coordinates
   - Forecast API returns current temperature, condition, humidity and wind
2. DummyJSON Quotes (https://dummyjson.com/docs/quotes)
   - Random quote, with a "New Quote" button
3. GitHub REST API (https://api.github.com)
   - Lists my public repositories with name, description, stars and language

CONFIGURATION
- To show GitHub repositories, set GITHUB_USERNAME at the top of api.js.

All API calls use async/await with fetch, show a loading message while
waiting, and show an error message if the request fails.
