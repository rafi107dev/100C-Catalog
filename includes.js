document.addEventListener("DOMContentLoaded", function () {
    function loadInclude(targetId, filePath, callback) {
        var container = document.getElementById(targetId);
        if (!container) return;

        fetch(filePath, { cache: "no-cache" })
            .then(r => r.text())
            .then(html => {
                container.innerHTML = html;
                if (callback) callback();
            })
            .catch(err => console.error(err));
    }

    // Load header, then update cart count once it's in the DOM
    loadInclude("shared-header", "includes/header.html", function() {
        if (typeof updateCartCount === "function") {
            updateCartCount(loadCart());
        }

        // Mobile dropdown handling
        var dropdown = document.querySelector(".closeout-dropdown");
        var dropdownToggle = document.querySelector(".nav-dropdown-toggle");
        var dropdownMenu = document.querySelector(".nav-dropdown-menu");

        if (dropdown && dropdownToggle && dropdownMenu) {
            // Toggle dropdown on click (for mobile)
            dropdownToggle.addEventListener("click", function(e) {
                e.preventDefault();
                dropdown.classList.toggle("is-open");
            });

            // Close on scroll
            window.addEventListener("scroll", function() {
                dropdown.classList.remove("is-open");
                dropdownToggle.blur();
            }, { passive: true });

            // Close when clicking outside
            document.addEventListener("click", function(e) {
                if (!dropdown.contains(e.target)) {
                    dropdown.classList.remove("is-open");
                }
            });

            // Close when a menu item is clicked
            dropdownMenu.addEventListener("click", function() {
                dropdown.classList.remove("is-open");
            });
        }
    });
    loadInclude("site-footer", "includes/footer.html");
});
