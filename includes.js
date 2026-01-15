document.addEventListener("DOMContentLoaded", function () {
    function loadInclude(targetId, filePath) {
        var container = document.getElementById(targetId);
        if (!container) return;

        fetch(filePath, { cache: "no-cache" })
            .then(r => r.text())
            .then(html => container.innerHTML = html)
            .catch(err => console.error(err));
    }

    loadInclude("shared-header", "includes/header.html");
    loadInclude("site-footer", "includes/footer.html");
});
