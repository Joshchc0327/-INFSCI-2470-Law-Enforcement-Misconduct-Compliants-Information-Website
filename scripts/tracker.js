document.addEventListener("DOMContentLoaded", () => {
  const formSubmittedKey = "formSubmitted";

  // Survey Page Functionality
  const discussionForm = document.getElementById("discussionForm");
  const cancelButton = document.querySelector(".cancel");

  if (discussionForm) {
    discussionForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Validate form fields
      const dateField = document.getElementById("date");
      const locationField = document.getElementById("location");
      const statusField = document.getElementById("status");

      if (!dateField.value.trim()) {
        alert("Please select a valid date.");
        return;
      }

      if (!locationField.value || locationField.value === "Select location") {
        alert("Please select a location.");
        return;
      }

      if (!statusField.value || statusField.value === "Select status") {
        alert("Please select a complaint status.");
        return;
      }

      // If all fields are valid, proceed to tracker page
      localStorage.setItem(formSubmittedKey, "true"); // Set flag to show alert on tracker.html
      window.location.href = "tracker.html"; // Redirect to tracker.html
    });

    cancelButton.addEventListener("click", () => {
      window.location.href = "tracker.html"; // Redirect to tracker.html
    });
  }

  // Tracker Page Functionality
  const searchButton = document.querySelector(".searchArea-button");
  const clearButton = document.querySelector(".clearArea-button");
  const searchInput = document.querySelector(".searchArea-input");
  const rows = document.querySelectorAll(".hide-data");

  if (searchButton && clearButton && searchInput && rows.length > 0) {
    // Check if form submission flag exists in localStorage
    if (localStorage.getItem(formSubmittedKey) === "true") {
      alert("Survey sent successfully");
      localStorage.removeItem(formSubmittedKey); // Clear flag after showing the alert
    }

    // Function to handle the search action
    function handleSearch() {
      // Hide all .hide-data rows regardless of input
      rows.forEach((row) => {
        row.style.display = "none";
      });
    }

    // Function to clear the input and show all rows
    function handleClear() {
      searchInput.value = ""; // Clear the search input
      rows.forEach((row) => {
        row.style.display = "table-row"; // Show all rows
      });
    }

    // Attach event listeners
    searchButton.addEventListener("click", handleSearch);
    clearButton.addEventListener("click", handleClear);

    // Optionally, trigger search on pressing Enter
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    });
  }
});
