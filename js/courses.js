// The whole file is wrapped in an IIFE (function that runs immediately).
// Why: this file is loaded as a normal <script>, so top-level const/let are SHARED
// with profile.js / theme.js. If any of them declares the same name
// (instructor, readSession, ...), the browser throws
// "Identifier '...' has already been declared" and NOTHING in this file runs
// (no button, no form, no courses). Inside the IIFE nothing can clash.
(function () {
    const API_URL = "http://localhost:3000/courses";

    // ==================================================
    // LOGGED-IN INSTRUCTOR
    // ==================================================

    const readSession = (key) => {
        try {
            return JSON.parse(sessionStorage.getItem(key) || localStorage.getItem(key) || null);
        } catch {
            return null;
        }
    };

    const instructor = readSession("currentInstructor");

    if (!instructor || !instructor.id) {
        // courses.html is inside /pages, the login page is one level up
        // (same path your "Log out" link uses)
        location.href = "../index.html";
        return;
    }

    const INSTRUCTORID = instructor.id;

    // ==================================================
    // DOM ELEMENTS
    // ==================================================

    const coursesContainer = document.getElementById("coursesContainer");
    const noCoursesMessage = document.getElementById("noCoursesMessage");
    const courseFormContainer = document.getElementById("courseFormContainer");
    const courseModal = new bootstrap.Modal(courseFormContainer);
    const courseForm = document.getElementById("courseForm");
    const addCourseBtn = document.getElementById("addCourseBtn");
    const submitCourseBtn = document.getElementById("submitCourseBtn");
    const courseFormTitle = document.getElementById("courseFormTitle");
    const courseName = document.getElementById("courseName");
    const courseDescription = document.getElementById("courseDescription");
    const courseCategory = document.getElementById("courseCategory");
    const searchInput = document.getElementById("searchInput");

    // ==================================================
    // STATE
    // ==================================================

    let editingCourseId = null; // null = Add mode, course id = Edit mode
    let allCourses = []; // only THIS instructor's courses

    // ==================================================
    // HELPERS
    // ==================================================

    const setFormMode = (editing) => {
        courseFormTitle.textContent = editing ? "Edit Course" : "Add Course";
        submitCourseBtn.textContent = editing ? "Update Course" : "Add Course";
    };

    const getVisibleCourses = () => {
        const term = searchInput.value.toLowerCase().trim();
        return allCourses.filter((c) => (c.name || "").toLowerCase().includes(term));
    };

    // ==================================================
    // RENDER COURSES
    // ==================================================

    function renderCourses(courses) {
        coursesContainer.innerHTML = "";

        // Empty state: different text for "no courses at all" vs "search found nothing"
        if (courses.length === 0) {
            const title = noCoursesMessage.querySelector("h3");
            const text = noCoursesMessage.querySelector("p");
            if (allCourses.length === 0) {
                title.textContent = "No courses yet";
                text.textContent = 'Click "Add Course" to create your first course.';
            } else {
                title.textContent = "No courses found";
                text.textContent = "Try another search term.";
            }
            noCoursesMessage.style.display = "block";
            return;
        }

        noCoursesMessage.style.display = "none";

        courses.forEach(function (course) {
            const column = document.createElement("div");
            column.classList.add("col-12", "col-md-6", "col-xl-4");

            const card = document.createElement("div");
            card.classList.add("course-card");

            const title = document.createElement("h3");
            title.classList.add("course-card-title");
            title.textContent = course.name;

            const description = document.createElement("p");
            description.classList.add("course-card-description");
            description.textContent = course.description;

            const category = document.createElement("span");
            category.classList.add("course-category");
            category.textContent = course.category;

            const actions = document.createElement("div");
            actions.classList.add("course-actions");

            const editButton = document.createElement("button");
            editButton.type = "button";
            editButton.textContent = "Edit";
            editButton.classList.add("btn", "btn-sm", "btn-outline-success");

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.textContent = "Delete";
            deleteButton.classList.add("btn", "btn-sm", "btn-outline-danger");

            actions.append(editButton, deleteButton);
            card.append(title, description, category, actions);
            column.appendChild(card);
            coursesContainer.appendChild(column);

            // ---------- EDIT ----------
            editButton.addEventListener("click", function () {
                editingCourseId = course.id;
                courseName.value = course.name;
                courseDescription.value = course.description;
                courseCategory.value = course.category;
                setFormMode(true);
                courseModal.show();
            });

            // ---------- DELETE ----------
            deleteButton.addEventListener("click", async function () {
                if (!confirm(`Are you sure you want to delete "${course.name}"?`)) return;

                try {
                    const response = await fetch(`${API_URL}/${course.id}`, { method: "DELETE" });
                    if (!response.ok) throw new Error("Failed to delete course");
                    await getCourses();
                } catch (error) {
                    console.error("Delete error:", error);
                    alert("Failed to delete course");
                }
            });
        });
    }

    // ==================================================
    // GET COURSES (only the logged-in instructor's)
    // ==================================================

    async function getCourses() {
        try {
            const response = await fetch(`${API_URL}?instructorId=${encodeURIComponent(INSTRUCTORID)}`);
            if (!response.ok) throw new Error(`Failed to fetch courses (${response.status})`);

            allCourses = (await response.json()).filter((c) => !c.isDeleted);

            // keep the current search text applied after reloading
            renderCourses(getVisibleCourses());
        } catch (error) {
            console.error("Get courses error:", error);
            alert("Failed to load courses. Is json-server running?");
        }
    }

    // ==================================================
    // SEARCH
    // ==================================================

    searchInput.addEventListener("input", function () {
        renderCourses(getVisibleCourses());
    });

    // ==================================================
    // SHOW ADD FORM
    // ==================================================

    addCourseBtn.addEventListener("click", function () {
        editingCourseId = null;
        courseForm.reset();
        setFormMode(false);
        courseModal.show();
    });

    // Focus the first field once the modal is really visible
    courseFormContainer.addEventListener("shown.bs.modal", function () {
        courseName.focus();
    });

    // Reset everything when the modal closes (Cancel / X / after save)
    courseFormContainer.addEventListener("hidden.bs.modal", function () {
        editingCourseId = null;
        courseForm.reset();
        setFormMode(false);

        document.getElementById("newCourseLink").classList.remove("active");
        document.getElementById("coursesLink").classList.add("active");
    });

    // ==================================================
    // FORM SUBMIT (POST / PATCH)
    // ==================================================

    courseForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const courseData = {
            name: courseName.value.trim(),
            description: courseDescription.value.trim(),
            category: courseCategory.value.trim(),
            instructorId: INSTRUCTORID,
        };

        if (!courseData.name || !courseData.description || !courseData.category) {
            alert("Please fill all fields");
            return;
        }

        const isEditing = editingCourseId !== null;

        try {
            const response = await fetch(isEditing ? `${API_URL}/${editingCourseId}` : API_URL, {
                method: isEditing ? "PATCH" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(courseData),
            });

            if (!response.ok) throw new Error(isEditing ? "Failed to update course" : "Failed to add course");

            await getCourses();
            courseModal.hide(); // the "hidden.bs.modal" handler resets the form
        } catch (error) {
            console.error("Save course error:", error);
            alert(isEditing ? "Failed to update course" : "Failed to add course");
        }
    });

    // ==================================================
    // SHORTCUT: ADD COURSE
    // ==================================================

    // Light up "Add course" in the sidebar while the modal is open for a new course
    courseFormContainer.addEventListener("show.bs.modal", function () {
        if (editingCourseId === null) {
            document.getElementById("coursesLink").classList.remove("active");
            document.getElementById("newCourseLink").classList.add("active");
            bootstrap.Collapse.getOrCreateInstance(document.getElementById("shortcutsMenu"), { toggle: false }).show();
        }
    });

    // Sidebar shortcut on this page: open the modal without reloading
    document.getElementById("newCourseLink").addEventListener("click", function (event) {
        event.preventDefault();
        addCourseBtn.click();
    });

    // ==================================================
    // INITIAL LOAD
    // ==================================================

    getCourses();

    // Open the modal when coming from another page (courses.html?new=true)
    if (new URLSearchParams(window.location.search).has("new")) {
        addCourseBtn.click();
        history.replaceState(null, "", "courses.html");
    }
})();