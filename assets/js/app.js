"use strict";
document
  .getElementById("allCountriesBtn")
  .addEventListener("click", fetchAllCountries);
document
  .getElementById("countryForm")
  .addEventListener("submit", searchCountries);

async function fetchAllCountries() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const countries = await response.json();
    displayStatistics(countries);
  } catch (error) {
    alert("Error fetching data");
  }
}

async function searchCountries(event) {
  event.preventDefault();

  const countryName = document.getElementById("countryName").value.trim();
  if (!countryName) {
    alert("Please enter a country name");
    return;
  }

  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/name/${countryName}`
    );
    const countries = await response.json();
    displayStatistics(countries);
  } catch (error) {
    alert("No results found");
  }
}

function displayStatistics(countries) {
  const resultsContainer = document.getElementById("resultsContainer");
  resultsContainer.innerHTML = "";

  if (countries.length === 0) {
    resultsContainer.innerHTML =
      "<div class='alert alert-warning'>No matching countries found</div>";
    return;
  }

  const totalCountries = countries.length;
  const totalPopulation = countries.reduce(
    (sum, country) => sum + (country.population || 0),
    0
  );
  const averagePopulation =
    totalCountries > 0 ? totalPopulation / totalCountries : 0;

  let statisticsHTML = `
        <h2>Search Results Statistics:</h2>
        <p><strong>Total countries matching search: </strong>${totalCountries}</p>
        <p><strong>Total countries population: </strong>${totalPopulation.toLocaleString()}</p>
        <p><strong>Average population: </strong>${Math.round(
          averagePopulation
        ).toLocaleString()}</p>
    `;

  statisticsHTML += `
        <h3>Country Population Table:</h3>
        <table class="table table-striped table-bordered results-table">
            <thead>
                <tr>
                    <th>Country Name</th>
                    <th>Population</th>
                </tr>
            </thead>
            <tbody>
    `;
  countries.forEach((country) => {
    statisticsHTML += `
            <tr>
                <td>${country.name.common}</td>
                <td>${country.population.toLocaleString()}</td>
            </tr>
        `;
  });
  statisticsHTML += "</tbody></table>";

  const regionCounts = countries.reduce((acc, country) => {
    const region = country.region || "Not Specified";
    acc[region] = (acc[region] || 0) + 1;
    return acc;
  }, {});

  statisticsHTML += `
        <h3>Number of countries by Region:</h3>
        <table class="table table-striped table-bordered results-table">
            <thead>
                <tr>
                    <th>Region</th>
                    <th>Number of Countries</th>
                </tr>
            </thead>
            <tbody>
    `;
  for (let region in regionCounts) {
    statisticsHTML += `
            <tr>
                <td>${region}</td>
                <td>${regionCounts[region]}</td>
            </tr>
        `;
  }
  statisticsHTML += "</tbody></table>";

  resultsContainer.innerHTML = statisticsHTML;
}
