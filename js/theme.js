const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

let theme = localStorage.getItem("theme") || "light";


function applyTheme() {
  document.documentElement.setAttribute("data-theme", theme);

  if (themeIcon) {
    themeIcon.className =
      theme === "dark"
        ? "bi bi-sun-fill"
        : "bi bi-moon-fill";
  }

  document.querySelectorAll(".theme-logo").forEach(function (logo) {

    if (theme === "dark") {
      logo.src = logo.dataset.darkSrc;
    } else {
      logo.src = logo.dataset.lightSrc;
    }

  });
}


applyTheme();


if (themeToggle) {

  themeToggle.addEventListener("click", function () {

    if (theme === "light") {
      theme = "dark";
    } else {
      theme = "light";
    }

    localStorage.setItem("theme", theme);

    applyTheme();

  });

}