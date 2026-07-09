function doSearch() {
    const query = document.querySelector(".search-input").value.trim();
    if (!query) return;
    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}
document.querySelector(".search-icon").addEventListener("click", doSearch);
document.querySelector(".search-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") doSearch();
});
const dots = document.querySelectorAll(".wp-dot");

dots.forEach((dot) => {
    dot.addEventListener("click", () => {
        const file = dot.getAttribute("data-file");
        document.body.style.backgroundImage = `url("wallpapers/${file}")`;

        dots.forEach((d) => d.classList.remove("active"));
        dot.classList.add("active");

        localStorage.setItem("suvriddhi-wallpaper", file);
    });
});

window.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem("suvriddhi-wallpaper");
    if (saved) {
        document.body.style.backgroundImage = `url("wallpapers/${saved}")`;
        dots.forEach((d) => {
            d.classList.toggle("active", d.getAttribute("data-file") === saved);
        });
    }
});

function updateClock() {
    const now = new Date();

    const dateStr = new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
        timeZone: "Asia/Kolkata",
    }).format(now);

    const timeStr = new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Kolkata",
    }).format(now);

    document.querySelector(".date").textContent = dateStr;
    document.querySelector(".time").textContent = timeStr;
}

updateClock();
setInterval(updateClock, 1000);

function updateOnlineStatus() {
    document.getElementById("offlineBanner").style.display = navigator.onLine
        ? "none"
        : "block";
}
updateOnlineStatus();
window.addEventListener("online", updateOnlineStatus);
window.addEventListener("offline", updateOnlineStatus);
