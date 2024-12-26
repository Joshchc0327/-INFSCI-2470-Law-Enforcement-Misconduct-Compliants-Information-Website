document.addEventListener("DOMContentLoaded", () => {
  const searchButton = document.querySelector(".search-button");
  const searchInput = document.querySelector(".search-input");
  const clearButton = document.querySelector(".clear-button");
  const tables = document.querySelectorAll(".info-table");
  let bubble = null; // InfoBubble
  let marker = null; // Current map marker
    /* Discussion page */
  const searchPostButton = document.querySelector(".searchPost-button");
  const searchPostInput = document.querySelector(".searchPost-input");
  const discussions = document.querySelectorAll(".discussion");

  // display tables
  if(searchButton){
    searchButton.addEventListener("click", () => {
      tables.forEach((table) => {
        table.style.display = "table";
      });
    });
  }
  
  // clear search content
  if(clearButton){
    clearButton.addEventListener("click", () => {
      searchInput.value = "";
      tables.forEach((table) => {
        table.style.display = "none";
      });
    });
  }

  // Reverse Geocoding: Get location information from coordinates
  function reverseGeocode(platform, coord, callback) {
    const geocoder = platform.getSearchService();

    geocoder.reverseGeocode(
      {
        at: `${coord.lat},${coord.lng}`,
      },
      (result) => {
        if (result.items && result.items.length) {
          const postalCode = result.items[0].address.postalCode || "N/A";
          const locationContent = `
              <div class="here-map-info-bubble">
                  <p><strong>ZIP Code:</strong> ${postalCode}</p>
                  <p><strong>Available Time: </strong>10am - 17pm</p>
                  <p><strong>Contact:</strong> 412-255-2621</p>
                  <p><strong>Notes:</strong> No complaint form, but very thorough information (on OMI) on it <a href="#">https://pittsburghpa.gov/omi/filing-complaint/</a></p>
              </div>`;
          callback(locationContent);
        } else {
          callback(`
              <div class="here-map-info-bubble">
                  <p><strong>Location not found</strong></p>
              </div>
            `);
        }
      },
      (error) => {
        console.error("Reverse geocoding failed:", error);
        callback(`
            <div class="here-map-info-bubble">
                <p><strong>Error retrieving location</strong></p>
            </div>
          `);
      }
    );
  }

  // Geocode Address: Get coordinates from user input
  function geocodeAddress(platform, query, callback) {
    const geocoder = platform.getSearchService();
    geocoder.geocode(
      {
        q: query,
      },
      (result) => {
        if (result.items && result.items.length > 0) {
          const location = result.items[0].position;
          callback(null, location);
        } else {
          callback("Location not found", null);
        }
      },
      (error) => {
        console.error("Geocoding failed:", error);
        callback("Error retrieving location", null);
      }
    );
  }

  // Map Click Listener: Handle click events to display location info
  function setUpClickListener(map) {
    map.addEventListener("tap", (evt) => {
      const coord = map.screenToGeo(
        evt.currentPointer.viewportX,
        evt.currentPointer.viewportY
      );

      reverseGeocode(platform, coord, (location) => {
        if (bubble) {
          ui.removeBubble(bubble);
        }

        bubble = new H.ui.InfoBubble(
          { lat: coord.lat, lng: coord.lng },
          {
            content: location, // Pass content directly from reverseGeocode
          }
        );
        ui.addBubble(bubble);
      });
    });
  }

  // Initialize HERE Maps
  const platform = new H.service.Platform({
    apikey: "bjVmBc2hpWGt1sn_mtnkvZCkuC0vqx_D3pp44ehO5AE", // Replace with your HERE Maps API Key
  });

  const defaultLayers = platform.createDefaultLayers();

  const map = new H.Map(
    document.getElementById("map"),
    defaultLayers.vector.normal.map,
    {
      center: { lat: 40.444611161087145, lng: -79.9521080838433 },
      zoom: 15,
    }
  );

  // Adjust map viewport on window resize
  window.addEventListener("resize", () => map.getViewPort().resize());

  // Enable map interaction
  const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

  // Add UI controls
  const ui = H.ui.UI.createDefault(map, defaultLayers);

  // Handle Address Search
  function handleSearch() {
    const query = searchInput.value.trim();
    if (query) {
      geocodeAddress(platform, query, (error, location) => {
        if (error) {
          alert(error);
        } else {
          if (marker) {
            map.removeObject(marker); // Remove previous marker
          }

          map.setCenter(location); // Center map to new location

          marker = new H.map.Marker(location); // Add new marker
          map.addObject(marker);
        }
      });
    } else {
      alert("Please enter a valid address.");
    }
  }

  // Attach event listeners
  searchButton.addEventListener("click", handleSearch);
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  });

  // Initialize map click listener
  setUpClickListener(map);

  // Ensure all required elements are present before proceeding
  if (searchPostButton && searchPostInput && discussions) {
    // Function to filter discussions based on search query
    function filterDiscussions() {
      const query = searchPostInput.value.trim().toLowerCase();

      // Show an alert if the search input is empty
      if (query === "") {
        alert("Please input valid content.");
        return;
      }

      // Iterate through all discussions and show/hide based on title match
      discussions.forEach((discussion) => {
        const title = discussion.querySelector("h2").textContent.toLowerCase();

        if (title.includes(query)) {
          discussion.style.display = "block"; // Show matching discussions
        } else {
          discussion.style.display = "none"; // Hide non-matching discussions
        }
      });
    }

    // Attach click event listener to the search button
    searchPostButton.addEventListener("click", filterDiscussions);

    // Attach keypress event listener to handle Enter key for search input
    searchPostInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        filterDiscussions();
      }
    });
  } else {
    console.error(
      "Search button, input field, or discussion elements are not found in the DOM."
    );
  }
});
