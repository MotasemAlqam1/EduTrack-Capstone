import { API_URL, requireInstructor } from "./session.js";
import { esc } from "./utils.js";

let Endpoint = `${API_URL}/students`;
let studentContainer = document.getElementById("students-list");
let form = document.getElementById("studentForm");
let editingStudentId = null;
let submitStudentBtn = document.getElementById("submitStudentBtn");
let filterButtons = document.querySelectorAll("[data-filter]");
let currentFilter = "all";
let students = [];
let courseFilter = document.getElementById("courseFilter");
let exportBtn = document.getElementById("exportBtn");
let addStudentBtn = document.getElementById("addStudentBtn");
let courses = []; // this instructor's courses (fills the dropdowns)

let courseRowsEl = document.getElementById("courseRows");
let addCourseRowBtn = document.getElementById("addCourseRowBtn");
let coursesHint = document.getElementById("coursesHint");

// ==================================================
// COURSE ROWS (dropdown + grade) inside the student modal
// ==================================================

function courseOptions(selected = "") {
    let names = courses.map(c => c.name);
    // keep a course the student already has even if it is not in the list anymore
    if (selected && !names.includes(selected)) names.push(selected);

    return `<option value="" disabled ${selected ? "" : "selected"}>Select course</option>` +
        names.map(n => `<option value="${esc(n)}" ${n === selected ? "selected" : ""}>${esc(n)}</option>`).join("");
}

function addCourseRow(course = {}) {
    let row = document.createElement("div");
    row.className = "course-row";
    row.innerHTML = `
        <select class="form-select course-select" required aria-label="Course">
            ${courseOptions(course.name)}
        </select>
        <input type="number" class="form-control grade-input" min="0" max="100" step="1"
            placeholder="Grade" aria-label="Grade" required value="${course.grade ?? ""}">
        <button type="button" class="remove-course-btn" title="Remove course" aria-label="Remove course">
            <i class="bi bi-x-lg"></i>
        </button>`;
    courseRowsEl.appendChild(row);
    refreshCourseRows();
}

// Replace all rows (always keeps at least one empty row)
function setCourseRows(list = []) {
    courseRowsEl.innerHTML = "";
    (list.length ? list : [{}]).forEach(addCourseRow);
}

// Disable courses already picked in another row, and the add / remove buttons when needed
function refreshCourseRows() {
    let rows = [...courseRowsEl.querySelectorAll(".course-row")];
    let chosen = rows.map(r => r.querySelector(".course-select").value).filter(Boolean);

    rows.forEach(row => {
        let select = row.querySelector(".course-select");
        [...select.options].forEach(option => {
            option.disabled = option.value === "" || (chosen.includes(option.value) && option.value !== select.value);
        });
        row.querySelector(".remove-course-btn").disabled = rows.length === 1;

    });

    let available = new Set([...courses.map(c => c.name), ...chosen]).size;
    addCourseRowBtn.disabled = rows.length >= available;

    coursesHint.textContent = courses.length === 0
        ? "You have no courses yet. Create a course first in the Courses page."
        : "";
}

// Every row needs a course and a grade (0 is allowed); at least one row is required
function readCourseRows() {
    return [...courseRowsEl.querySelectorAll(".course-row")].map(row => ({
        name: row.querySelector(".course-select").value,
        grade: Number(row.querySelector(".grade-input").value)
    }));
}

addCourseRowBtn.addEventListener("click", () => addCourseRow());
courseRowsEl.addEventListener("change", refreshCourseRows);
courseRowsEl.addEventListener("click", (event) => {
    let btn = event.target.closest(".remove-course-btn");
    if (!btn) return;
    btn.closest(".course-row").remove();
    refreshCourseRows();
});

// Load only the logged-in instructor's courses, fill the filter + the modal dropdowns
async function loadCourses() {
    try {
        let response = await fetch(`${API_URL}/courses?instructorId=${encodeURIComponent(INSTRUCTORID)}`);
        if (!response.ok) throw new Error("Failed to fetch courses");
        courses = (await response.json()).filter(c => !c.isDeleted);

        courseFilter.innerHTML =
            `<option value="all">All courses</option>` +
            courses.map(c => `<option value="${esc(c.name)}">${esc(c.name)}</option>`).join("");
    } catch (error) {
        console.log("Error:", error);
    }
    setCourseRows([]);
}

// let archivedInput = document.getElementById("status-archived");
// let archivedLabel = document.querySelector('label[for="status-archived"]');

// Hide Archived option 
// function hideArchived() {
//     archivedInput.hidden = true;
//     archivedLabel.hidden = true;
//     document.getElementById("status-active").checked = true;

// }
// // Show Archived option 
// function showArchived() {
//     archivedInput.hidden = false;
//     archivedLabel.hidden = false;
// }

// Add Student button
addStudentBtn.addEventListener("click", () => {
    editingStudentId = null;

    submitStudentBtn.textContent = "Add Student";
    document.getElementById("studentTitle").textContent = "Add New Student";

    form.reset();
    setCourseRows([]);

    document.getElementById("statusField").style.display = "none";
});

// Get logged-in instructor
const instructor = requireInstructor("../index.html");
const INSTRUCTORID = instructor.id;



// Render Student
function RenderStudent(student) {

    studentContainer.insertAdjacentHTML("afterbegin", `
        <tr>
            <td>
                <strong>${esc(student.name)}</strong>
               
            </td>

            <td>${esc(student.email)}</td>

            <td>${esc(student.phone || "N/A")}</td>

            <td>
                ${student.courses
            .map(course => `
                        <span class="course">
                            ${esc(course.name)}
                            <span class="course-grade">${course.grade}</span>
                        </span>
                    `)
            .join("")}
            </td>

            <td>
                <span class="status ${student.status}">
                    ${student.status}
                </span>
            </td>

            <td>
                <div class="actions">

                    <button
                        class="action-btn update-btn"
                        title="Update"
                        data-action="edit"
                        data-id="${student.id}">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>

                    <button
                        class="action-btn delete-btn"
                        title="Delete"
                        data-action="delete"
                        data-id="${student.id}">
                        <i class="fa-solid fa-trash"></i>
                    </button>

                </div>
            </td>
        </tr>
    `);
}

function filterStudents() {

    studentContainer.innerHTML = "";

    let selectedCourse = courseFilter.value;

    let filteredStudents = students.filter(student => {

        let statusMatch =
            currentFilter === "all" ||
            student.status === currentFilter;

        let courseMatch =
            selectedCourse === "all" ||
            student.courses.some(course =>
                course.name === selectedCourse
            );

        return statusMatch && courseMatch;
    });

    filteredStudents.forEach(student => RenderStudent(student));

    return filteredStudents;
}

// Edit / Delete buttons (replaces inline onclick, which modules can't see)
studentContainer.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-action]");
    if (!btn) return;
    const { action, id } = btn.dataset;
    if (action === "edit") updatestudent(id);
    if (action === "delete") deletestudent(id);
});

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        filterStudents();
    });

});


courseFilter.addEventListener("change", () => {

    filterStudents();

});

exportBtn.addEventListener("click", () => {

    let filteredStudents = filterStudents();

    if (filteredStudents.length === 0) {
        alert("No students to export.");
        return;
    }

    let csv = "Name,Student ID,Email,Phone,Courses,Status\n";

    filteredStudents.forEach(student => {

        let courses = student.courses
            .map(course => `${course.name}:${course.grade}`)
            .join(" | ");

        csv += `"${student.name}","${student.studentId}","${student.email}","${student.phone || ""}","${courses}","${student.status}"\n`;
    });

    let blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;"
    });

    let url = URL.createObjectURL(blob);

    let link = document.createElement("a");

    link.href = url;
    link.download = "students.csv";

    link.click();

    URL.revokeObjectURL(url);
});


// GET
async function getstudent() {

    try {

        let response = await fetch(Endpoint);

        if (!response.ok) {
            throw new Error("Failed to fetch Students");
        }

        let data = await response.json();

        students = data.filter(student =>
            !student.isDeleted &&
            student.instructorId === INSTRUCTORID
        );

        filterStudents();

    } catch (error) {

        console.log("Error:", error);

    }
}


// POST / PATCH
async function addstudent(event) {

    event.preventDefault();

    try {

        // Get form data
        let student = Object.fromEntries(new FormData(form));
        student.instructorId = INSTRUCTORID;
        student.isDeleted = false;

        if (!editingStudentId) {
            student.status = "active";
        }

        // Courses come from the dropdown rows: [{ name, grade }]
        student.courses = readCourseRows();


        let response;


        // UPDATE
        if (editingStudentId) {

            response = await fetch(
                `${Endpoint}/${editingStudentId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(student)
                }
            );

        }

        // ADD
        else {

            response = await fetch(
                Endpoint,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(student)
                }
            );

        }


        if (!response.ok) {
            throw new Error("Failed to save student");
        }


        // Reset form
        form.reset();
        setCourseRows([]);

        // Reset editing mode
        editingStudentId = null;

        // Reset button
        submitStudentBtn.textContent = "Add Student";

        // Refresh table
        studentContainer.innerHTML = "";

        getstudent();


        // Close modal
        let modal = bootstrap.Modal.getInstance(
            document.getElementById("studentModal")
        );

        if (modal) {
            modal.hide();
        }

    } catch (error) {

        console.log("Error:", error);

    }
}


form.addEventListener("submit", addstudent);


// DELETE - Soft Delete
async function deletestudent(id) {

    try {

        let response = await fetch(
            `${Endpoint}/${id}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    isDeleted: true
                })
            }
        );


        if (!response.ok) {
            throw new Error("Failed to delete student");
        }


        studentContainer.innerHTML = "";

        getstudent();

    } catch (error) {

        console.log("Error:", error);

    }
}


// PUT - Update
async function updatestudent(id) {
    try {
        let response = await fetch(`${Endpoint}/${id}`);

        if (!response.ok) {
            throw new Error("Failed to fetch student");
        }

        let student = await response.json();

        // Save ID
        editingStudentId = id;

        // Change title and button text
        document.getElementById("studentTitle").textContent = "Edit student";
        submitStudentBtn.textContent = "Update student";

         document.getElementById("statusField").style.display = "block";

        // Put student data inside form
        document.getElementById("f-name").value = student.name;
        // document.getElementById("f-code").value = student.studentId;
        document.getElementById("f-email").value = student.email;
        document.getElementById("f-phone").value = student.phone || "";

        // Fill the course rows (dropdown + grade)
        setCourseRows(student.courses || []);

        // Select status
        if (student.status === "archived") {
            document.getElementById("status-archived").checked = true;
        } else {
            document.getElementById("status-active").checked = true;
        }

        // Open modal
        let modal = bootstrap.Modal.getOrCreateInstance(
            document.getElementById("studentModal")
        );

        modal.show();

    } catch (error) {
        console.log("Error:", error);
    }
}
// ==================================================
// SHORTCUT: ADD STUDENT
// ==================================================

const newStudentLink = document.getElementById("newStudentLink");
const studentsLink = document.querySelector('.sidebar a.nav-link[href="students.html"]');
const studentModalEl = document.getElementById("studentModal");

// Light up "Add student" in the sidebar while the modal is open for a NEW student
studentModalEl.addEventListener("show.bs.modal", () => {
    if (editingStudentId === null) {
        studentsLink?.classList.remove("active");
        newStudentLink.classList.add("active");
        bootstrap.Collapse.getOrCreateInstance(
            document.getElementById("shortcutsMenu"),
            { toggle: false }
        ).show();
    }
});

studentModalEl.addEventListener("hidden.bs.modal", () => {
    newStudentLink.classList.remove("active");
    studentsLink?.classList.add("active");
});

// Sidebar shortcut on this page: open the modal without reloading
newStudentLink.addEventListener("click", (event) => {
    event.preventDefault();
    addStudentBtn.click(); // resets the form and opens the modal in Add mode
});

// Coming from another page (students.html?new=true)
if (new URLSearchParams(window.location.search).has("new")) {
    addStudentBtn.click();
    history.replaceState(null, "", "students.html");
}

await loadCourses();
getstudent();