import countries from "./custom.geo.json";
const countrySearch = document.getElementById("countrySearch");

countrySearch.addEventListener("input", (event) => {
  const searchTerm = event.target.value.toLowerCase();
  const country = countries.features.find((feature) =>
    feature.properties.name.toLowerCase().includes(searchTerm)
  );

  if (country) {
    const { lat, lon } = country.properties; // Assuming you have latitude and longitude data
    const targetPosition = latLonToXYZ(lat, lon, 1.05); // Zoom into the country
    zoomToLocation(targetPosition);
  }
});

// Update zoomToLocation to work with target positions
function zoomToLocation(position) {
  const zoomDuration = 1000;
  new TWEEN.Tween(camera.position)
    .to({ x: position.x, y: position.y, z: position.z + 2 }, zoomDuration)
    .easing(TWEEN.Easing.Quadratic.Out)
    .start();
}

// Function to search for a location and zoom to it
function searchLocation() {
  const searchInput = document.getElementById("locationSearch");
  const locationName = searchInput.value.trim().toLowerCase();

  if (!locationName) {
    alert("Please enter a location name.");
    return;
  }
  alert("Searching for " + locationName);

  // Find the matching location
  const location = locations.find(
    (loc) => loc.name.toLowerCase() === locationName
  );

  if (location) {
    const { lat, lon, name } = location;
    const markerPosition = latLonToXYZ(lat, lon, 1.05); // Slightly larger radius than Earth

    // Zoom to the location's coordinates
    zoomToLocation(markerPosition);
  } else {
    alert("Location not found!");
  }
}

// Add event listener for the search button
document
  .getElementById("searchButton")
  .addEventListener("click", searchLocation);
