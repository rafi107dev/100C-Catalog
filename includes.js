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
    });
    loadInclude("site-footer", "includes/footer.html");
});
