document.addEventListener("DOMContentLoaded", () => {
    // Existing code...

    const infoButton = document.querySelector(".info-button");
    const infoBubble = document.querySelector(".info-bubble");
    const exitButton = document.querySelector(".exit-button");

    // Toggle info bubble visibility and position
    infoButton.addEventListener("click", () => {
        if (infoBubble.style.display === "block") {
            infoBubble.style.display = "none";
        } else {
            // Position the info-bubble next to the info-button
            const rect = infoButton.getBoundingClientRect();
            infoBubble.style.top = `${rect.top + window.scrollY + rect.height + 5}px`;
            infoBubble.style.left = `${rect.left + window.scrollX}px`;
            infoBubble.style.display = "block";
        }
    });

    // Close the info bubble when the exit button is clicked
    exitButton.addEventListener("click", () => {
        infoBubble.style.display = "none";
    });

    // Existing code...
});
