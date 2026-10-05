//? IIFE:  Immediately Invoked Function Expression
// Breadcrumb indicator: shows which section (and which form) the user is in.
// Classic script wrapped in an IIFE so its names can't clash with other files.
(function () {
  const PAGES = {
    "dashboard.html":   { name: "Dashboard" },
    "students.html":    { name: "Students",    modal: "studentModal",        title: "studentTitle" },
    "assessments.html": { name: "Assessments", modal: "assessmentModal",     title: "assessmentTitle" },
    "courses.html":     { name: "Courses",     modal: "courseFormContainer", title: "courseFormTitle" },
    "resources.html":   { name: "Resources",   modal: "resourceModal",       title: "resourceTitle" },
  };

  // Modals that exist on every page
  const COMMON_MODALS = {
    profileModal: "My profile",
    changePasswordModal: "Change password",
  };

  const file = location.pathname.split("/").pop() || ""; // file name is the last element in the array
  const page = PAGES[file]; 
  const main = document.querySelector("main");
  if (!page || !main) return;

  const esc = (s = "") =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const nav = document.createElement("nav");
  nav.className = "crumbs mb-3";
  nav.setAttribute("aria-label", "Breadcrumb"); // The navigation 
  main.prepend(nav);

  // extra = the name of the open form, or "" when none is open
  function render(extra = "") {
    const trail = [{ label: "Dashboard", href: "dashboard.html" }];
    if (page.name !== "Dashboard") trail.push({ label: page.name, href: file });
    if (extra) trail.push({ label: extra });

    nav.innerHTML =
      `<ol class="breadcrumb mb-0">` +
      trail
        .map((item, i) =>
          (i === trail.length - 1) //is it the last item
            ? `<li class="breadcrumb-item active" aria-current="page">${esc(item.label)}</li>`
            : `<li class="breadcrumb-item"><a href="${item.href}">${esc(item.label)}</a></li>`,
        )
        .join("") +
      `</ol>`;
  }

  // Bootstrap modal events bubble, so one listener on document covers every modal
  document.addEventListener("show.bs.modal", (e) => { //Bootstrap event
    const id = e.target.id; // modal id
    if (COMMON_MODALS[id]) return render(COMMON_MODALS[id]);
    if (id === page.modal) {
      const title = document.getElementById(page.title);
      render(title ? title.textContent.trim() : "");
    }
  });

  document.addEventListener("hidden.bs.modal", () => render());//modal closed bootstrap event

  render();
})();