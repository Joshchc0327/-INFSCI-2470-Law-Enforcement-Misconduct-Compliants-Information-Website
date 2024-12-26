document.addEventListener("DOMContentLoaded", () => {
  const searchPostButton = document.querySelector(".searchPost-button");
  const clearPostButton = document.querySelector(".clearPost-button"); // Clear button from HTML
  const searchPostInput = document.querySelector(".searchPost-input");
  const discussionsContainer = document.getElementById("discussionsContainer");
  const discussions = document.querySelectorAll(".discussion");

  // Ensure all required elements are present before proceeding
  if (searchPostButton && searchPostInput && discussionsContainer && clearPostButton) {
    // Function to filter discussions based on search query
    function filterDiscussions() {
      const query = searchPostInput.value.trim().toLowerCase();

      if (query === "") {
        discussions.forEach((discussion) => {
          discussion.style.display = "block";
        });
        return;
      }

      discussions.forEach((discussion) => {
        const title = discussion.querySelector("h2").textContent.toLowerCase();

        if (title.includes(query)) {
          discussion.style.display = "block";
        } else {
          discussion.style.display = "none";
        }
      });
    }

    // Function to clear the input field and show all discussions
    function clearInput() {
      searchPostInput.value = "";
      discussions.forEach((discussion) => {
        discussion.style.display = "block";
      });
    }

    // Attach event listeners
    searchPostButton.addEventListener("click", filterDiscussions);
    searchPostInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        filterDiscussions();
      }
    });
    clearPostButton.addEventListener("click", clearInput);
  } else {
    console.error(
      "Search button, input field, discussion elements, or clear button are not found in the DOM."
    );
  }

  // Handle new discussion from new-discussion.html
  const newDiscussion = localStorage.getItem("newDiscussion");
  if (newDiscussion) {
    const discussion = JSON.parse(newDiscussion);

    const article = document.createElement("article");
    article.classList.add("discussion");
    article.innerHTML = `
      <div class="discussion-header">
        <div class="avatar"></div>
        <div class="header-content">
          <h2>${discussion.title}</h2>
          <p>
            <span class="author">${discussion.author}</span> on <span class="date">${discussion.date}</span>
            <span class="location">
              <i class="location-icon"></i> ${discussion.location}
            </span>
          </p>
        </div>
      </div>
      <p>${discussion.content}</p>
      <div class="meta">New discussion</div>
    `;

    discussionsContainer.prepend(article);
    localStorage.removeItem("newDiscussion");
  }
});
