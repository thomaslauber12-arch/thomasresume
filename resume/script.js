document.addEventListener("DOMContentLoaded", () => {
    const navButtons = document.querySelectorAll(".nav-btn");
    const pages = document.querySelectorAll(".page");

    // Set initial page fade-in
    const activePage = document.querySelector(".page.active");
    if (activePage) {
        setTimeout(() => activePage.classList.add("fade-in"), 10);
    }

    navButtons.forEach(button => {
        button.addEventListener("click", () => {
            const targetPageId = button.getAttribute("data-page");

            if (button.classList.contains("active")) return;

            // Update button active state
            navButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            // Fade out current active page
            const currentActivePage = document.querySelector(".page.active");
            if (currentActivePage) {
                currentActivePage.classList.remove("fade-in");

                setTimeout(() => {
                    currentActivePage.classList.remove("active");

                    // Show and fade in new page
                    const newPage = document.getElementById(targetPageId);
                    if (newPage) {
                        newPage.classList.add("active");
                        setTimeout(() => newPage.classList.add("fade-in"), 10);
                    }
                }, 400); // Matches CSS transition duration
            }
        });
    });
});
