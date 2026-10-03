const API_URL = "http://localhost:3000";
const RES_URL = `${API_URL}/resources`;
const COURSES_URL = `${API_URL}/courses`;
//? From Google cloud console -> create youtube API key -> save in config.js
import { YT_KEY } from "./config.js";

// Logged-in instructor (currentInstructor), Extract from session
const readSession = (key) => {
    try {
        return JSON.parse(sessionStorage.getItem(key) || localStorage.getItem(key) || null);
    } catch {
        return null;
    }
};

const instructor = readSession("currentInstructor");
if (!instructor || !instructor.id) {
    location.href = "../index.html"; // Not logged in
    throw new Error("No logged-in instructor");
}

const INSTRUCTORID = instructor.id;

let courses = []; // Current instructor courses

const form = document.getElementById("resourceForm");
const list = document.getElementById("resources-list");
const modalEl = document.getElementById("resourceModal");
//? Take that HTML element and turn it into a Bootstrap Modal object that JavaScript can control.
const modal = new bootstrap.Modal(modalEl);
const resultsBox = document.getElementById("results");
let editingId = null;
let filters = { type: "", course: "" };

/** **esc:** takes text and makes it safe to put inside HTML */
const esc = (s = "") =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const toast = (msg) => {
    const t = document.createElement("div");
    t.className = "toast-x";
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2200);
};

// Extract youtubeId using reqular expression (regex)
const youtubeId = (url) => (url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/) || [])[1];

//? Read
const getResources = async () => {
    // Create a query string in URL
    // Not do it manualy so type and course must not be empty in query
    const params = new URLSearchParams({ instructorId: INSTRUCTORID });

    // Add type & course into query.
    if (filters.type) params.set("type", filters.type);
    if (filters.course) params.set("course", filters.course);

    // Fetch youtube result
    const res = await fetch(`${RES_URL}?${params}`);
    if (!res.ok) throw new Error(`Failed to load resources (${res.status})`);

    return res.json();
};

const renderResources = (items) => {
    if (!items.length) {
        list.innerHTML = `<div class="col-12"><div class="box empty">
      <div class="ico"><i class="bi bi-collection-play"></i></div>
      <h3>No resources yet</h3><p class="mb-0">Click "Add resource" to attach a video or PDF to a course.</p></div></div>`;
        return;
    }
    list.innerHTML = items
        .slice() // Create a copy of the array cuz reverse change the original.
        .reverse() // The newest resources first.
        .map((r) => {
            // thumb: short preview image if it is not exist
            // the image comes from YouTube's thumbnail server
            const thumb = r.thumbnail || (r.type === "video" && youtubeId(r.link) ? `https://i.ytimg.com/vi/${youtubeId(r.link)}/mqdefault.jpg` : "");
            //   Decide whitch icon to use later for video or pdf
            const icon = r.type === "video" ? "bi-play-circle" : "bi-file-earmark-pdf";
            return `
      <div class="col-sm-6 col-xl-4">
        <div class="res-card">
          <div class="res-thumb">${thumb ? `<img src="${esc(thumb)}" alt="" loading="lazy">` : `<i class="bi ${icon}"></i>`}</div>
          <div class="res-body">
            <div><span class="badge-soft b-ok">${esc(r.course)}</span>
                 <span class="badge-soft b-arch">${r.type === "video" ? "Video" : "PDF"}</span></div>
            <h3>${esc(r.title)}</h3>
            <small class="text-muted">Topic: ${esc(r.topic)}</small>
            <div class="res-foot">
              <a class="btn-line text-decoration-none" href="${esc(r.link)}" target="_blank" rel="noopener">Open</a>
              <button class="btn-ico ms-auto" title="Edit" onclick="editResource('${r.id}')"><i class="bi bi-pencil-square"></i></button>
              <button class="btn-ico" title="Delete" onclick="deleteResource('${r.id}')"><i class="bi bi-trash text-danger"></i></button>
            </div>
          </div>
        </div>
      </div>`;
        })
        .join(""); // from array into one code
};

// Check if there is resources
const loadResources = async () => {
    try {
        renderResources(await getResources());
    } catch (e) {
        list.innerHTML = `<div class="col-12 form-error">${esc(e.message)}. Is json-server running?</div>`;
    }
};

// External Search [ GET ]

const searchResources = async (topic, course, type) => {
    const q = `${topic} ${course}`;
    if (type === "video") {
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=6&q=${encodeURIComponent(q)}&key=${YT_KEY}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("YouTube search failed (check your API key / quota)");
        const data = await res.json();
        return data.items.map((v) => ({
            // snippet is an obj in youtube API that contain basic info about the video
            title: v.snippet.title,
            link: `https://www.youtube.com/watch?v=${v.id.videoId}`,
            thumbnail: v.snippet.thumbnails.medium.url,
        }));
    }
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&has_fulltext=true&limit=8&fields=title,cover_i,ia`;
    const res = await fetch(url);
    if (!res.ok)
        throw new Error("OpenLibrary search failed");
    const data = await res.json();
    // ia: Internet Archive identifier
    return data.docs
        .filter((d) => d.ia && d.ia.length)
        .map((d) => ({
            title: d.title,
            link: `https://archive.org/details/${d.ia[0]}`,
            thumbnail: d.cover_i ? `https://covers.openlibrary.org/b/id/${d.cover_i}-S.jpg` : "",
        }));
};

// Search
document.getElementById("searchBtn").addEventListener("click", async () => {
    const topic = form.topic.value.trim();
    if (!topic) return form.topic.focus();
    resultsBox.hidden = false;
    resultsBox.innerHTML = `<p class="text-muted mb-0">Searching…</p>`;
    try {
        const items = await searchResources(topic, form.course.value, form.type.value);
        if (!items.length) {
            resultsBox.innerHTML = `<p class="text-muted mb-0">No results. You can paste a link manually below.</p>`;
            return;
        }
        resultsBox.innerHTML =
            `<div class="d-grid gap-2">` +
            items
                .map(
                    (r, i) => `<button type="button" class="result-item" data-i="${i}">
            ${r.thumbnail ? `<img src="${esc(r.thumbnail)}" alt="">` : `<img alt="">`}<span>${esc(r.title)}</span></button>`
                )
                .join("") +
            `</div>`;
        resultsBox.onclick = (e) => {
            const btn = e.target.closest(".result-item");
            if (!btn) return;
            const r = items[btn.dataset.i];
            form.title.value = r.title;
            form.link.value = r.link;
            document.getElementById("r-thumb").value = r.thumbnail;
        };
    } catch (e) {
        resultsBox.innerHTML = `<p class="form-error mb-0">${esc(e.message)}. You can paste a link manually below.</p>`;
    }
});

// POST & PATCH
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    // collects the values from the form automatically
    const data = Object.fromEntries(new FormData(form));
    data.instructorId = INSTRUCTORID;
    // find selected courses
    const course = courses.find((c) => c.name === data.course);
    if (!course) return toast("Choose one of your courses");
    data.courseId = course.id; // set the course id like what in db.json
    // Send date to json server
    // Post new one 
    // Edit exist one.
    try {
        // RES_URL alone if post
        const res = await fetch(editingId ? `${RES_URL}/${editingId}` : RES_URL, {
            method: editingId ? "PATCH" : "POST", // if no editing id then we want to post
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to save resource");
        modal.hide(); // hide the form
        toast(editingId ? "Resource updated" : "Resource added");
        loadResources();
    } catch (err) {
        toast(err.message);
    }
});

const openModal = (resource = null) => {
    form.reset();
    resultsBox.hidden = true;
    resultsBox.innerHTML = "";
    editingId = resource ? resource.id : null;
    document.getElementById("resourceTitle").textContent = resource ? "Edit Resource" : "Add Resource";
    document.getElementById("submitBtn").textContent = resource ? "Update Resource" : "Add Resource";
    if (resource) {
        form.course.value = resource.course;
        form.topic.value = resource.topic;
        form.title.value = resource.title;
        form.link.value = resource.link;
        document.getElementById("r-thumb").value = resource.thumbnail || "";
        document.getElementById(`type-${resource.type}`).checked = true;
    }
    modal.show();
};

document.getElementById("addBtn").addEventListener("click", () => openModal());

// This file is loaded as a module, so inline onclick="" handlers can only see window.*
// because of type="module" editResource will not be visible to HTML so we use window
window.editResource = async (id) => {
    const res = await fetch(`${RES_URL}/${id}`); // fetch that resource
    if (res.ok) openModal(await res.json()); // open the same module
};

// DELETE
window.deleteResource = async (id) => {
    if (!confirm("Delete this resource?")) return;
    const res = await fetch(`${RES_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) return toast("Failed to delete");
    toast("Resource deleted");
    loadResources();
};

// FILTERS & INIT 
// Only the logged-in instructor's courses: GET /courses?instructorId=<id>
const loadCourses = async () => {
    const res = await fetch(`${COURSES_URL}?instructorId=${encodeURIComponent(INSTRUCTORID)}`);
    if (!res.ok) throw new Error(`Failed to load courses (${res.status})`);
    courses = (await res.json()).filter((c) => !c.isDeleted);

    // courses drop-down menu
    const options = courses.map((c) => `<option value="${esc(c.name)}">${esc(c.name)}</option>`).join("");
    form.course.innerHTML = options;
    document.getElementById("filterCourse").innerHTML = `<option value="">All courses</option>${options}`;

    // No courses yet: block adding resources and explain why
    const addBtn = document.getElementById("addBtn");
    addBtn.disabled = courses.length === 0;
    addBtn.title = courses.length === 0 ? "Create a course first" : "";
};

// Change the value when user change the course
document.getElementById("filterCourse").addEventListener("change", (e) => {
    filters.course = e.target.value;
    loadResources();
});

// active current btn
document.querySelectorAll(".nav-tabs-x [data-type]").forEach((btn) =>
    btn.addEventListener("click", () => {
        document.querySelectorAll(".nav-tabs-x [data-type]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        filters.type = btn.dataset.type; // data-type attribute like -> video
        loadResources();
    })
);

const init = async () => {
    try {
        await loadCourses();
    } catch (e) {
        list.innerHTML = `<div class="col-12 form-error">${esc(e.message)}. Is json-server running?</div>`;
        return;
    }
    loadResources();
};

init();