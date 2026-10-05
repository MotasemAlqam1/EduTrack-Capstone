import { API_URL, requireInstructor } from "./session.js";
import { toast } from "./utils.js";

const currentInstructor = requireInstructor("../index.html");

let Endpoint = `${API_URL}/assessments`;
const COURSES_URL = `${API_URL}/courses`;
const STUDENTS_URL = `${API_URL}/students`;
let tableBody = document.getElementById("assessmentsTableBody");
let form = document.getElementById("assessmentForm");
let deletingId = null;
let editingId = null;
let currentType = "All";
let currentCourse = "All courses";
let currentStudent = "All students";
let visibleAssessments = [];
let courses = []; // Current instructor courses
let students = []; // Current instructor students

let typeClasses = {
  Assignment: "t-assign",
  Quiz: "t-quiz",
  Exam: "t-exam",
};

let statusClasses = {
  Active: "bg-success",
  Ended: "bg-secondary",
};

let assessmentsLink = document.getElementById("assessmentsLink");
let newAssessmentLink = document.getElementById("newAssessmentLink");

// Makes text safe to put inside HTML
const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Only the logged-in instructor's courses: GET /courses?instructorId=<id>
async function loadCourses() {
  let response = await fetch(
    `${COURSES_URL}?instructorId=${encodeURIComponent(currentInstructor.id)}`,
    // encodeURL is important when strincg have spaces and special characters
  );
  if (!response.ok) {
    throw new Error("Failed to fetch courses");
  }
  courses = (await response.json()).filter((c) => !c.isDeleted);

  let options = courses
    .map((c) => `<option value="${esc(c.name)}">${esc(c.name)}</option>`)
    .join("");
  document.getElementById("a-course").innerHTML = options;
  document.getElementById("courseFilter").innerHTML =
    `<option value="All courses">All courses</option>${options}`;

  // No courses yet: block creating assessments
  document
    .querySelectorAll('[data-bs-target="#assessmentModal"], #newAssessmentLink')
    .forEach((el) => el.classList.toggle("disabled", courses.length === 0));
}

async function loadStudents() {
  let response = await fetch(
    `${STUDENTS_URL}?instructorId=${encodeURIComponent(currentInstructor.id)}`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch students");
  }
  students = (await response.json()).filter((s) => !s.isDeleted);

  let checkboxes = students
    .map(
      (s) => `
    <div class="form-check">
      <input class="form-check-input student-check" type="checkbox"
        id="std-${esc(s.id)}" value="${esc(s.id)}">
      <label class="form-check-label w-100" for="std-${esc(s.id)}">${esc(s.name)}</label>
    </div>`,
    )
    .join("");

  document.getElementById("studentList").innerHTML =
    students.length === 0
      ? `<div class="text-muted small">No students yet</div>`
      : `<div class="form-check select-all">
         <input class="form-check-input" type="checkbox" id="std-all">
         <label class="form-check-label" for="std-all">All students</label>
       </div>
       <div class="student-scroll">${checkboxes}</div>`;

  // No students yet: block choosing students
  document
    .getElementById("a-std")
    .classList.toggle("disabled", students.length === 0);
}

function updateStudentLabel() {
  let boxes = [...document.querySelectorAll("#studentList .student-check")];
  let checked = boxes.filter((box) => box.checked);
  let button = document.getElementById("a-std");

  if (checked.length === 0) {
    button.textContent = "Select students";
  } else if (checked.length === boxes.length) {
    button.textContent = "All students";
  } else if (checked.length === 1) {
    button.textContent = checked[0].nextElementSibling.textContent;
  } else {
    button.textContent = `${checked.length} students`;
  }
}

document.getElementById("studentList").addEventListener("change", (e) => {
  let all = document.getElementById("std-all");
  let boxes = document.querySelectorAll(".student-check");

  if (e.target.id === "std-all") {
    boxes.forEach((box) => (box.checked = e.target.checked));
  } else {
    all.checked = [...boxes].every((box) => box.checked);
  }

  updateStudentLabel();
});

async function getAssessments() {
  try {
    let response = await fetch(Endpoint);
    if (!response.ok) {
      throw new Error("Failed to fetch Assessments");
    }
    let data = await response.json();
    let assessments = data.filter(
      (assessment) =>
        !assessment.isDeleted &&
        assessment.instructorId === currentInstructor.id,
    );
    visibleAssessments = assessments.filter(
      (a) =>
        (currentType === "All" || a.type === currentType) &&
        (currentCourse === "All courses" || a.course === currentCourse),
    );
    visibleAssessments.forEach((assessment) => RenderAssessment(assessment));
    renderStats(assessments);
    renderTabs(assessments);
  } catch (error) {
    console.log("Error:", error);
  }
}

function RenderAssessment(assessment) {
  let status = getStatus(assessment);
  tableBody.insertAdjacentHTML(
    "beforeend",
    `
    <tr>
      <td>${esc(assessment.title)}</td>
      <td>${esc(assessment.course)}</td>
      <td><span class="badge rounded-pill ${typeClasses[assessment.type]}">${assessment.type}</span></td>
      <td>${assessment.dueDate}</td>
      <td><span class="badge ${statusClasses[status]}">${status}</span></td>
      <td class="text-end">
        <button class="btn btn-sm btn-light" title="Edit" data-action="edit" data-id="${assessment.id}">
          <i class="bi bi-pencil-square"></i>
        </button>
        <button class="btn btn-sm btn-light text-danger" title="Delete" data-action="delete" data-id="${assessment.id}">
          <i class="bi bi-trash3"></i>
        </button>
      </td>
    </tr>
    `,
  );
}

function getStatus(assessment) {
  let today = new Date().toLocaleDateString("en-CA");
  return assessment.dueDate >= today ? "Active" : "Ended";
}

function renderStats(assessments) {
  let graded = assessments.filter((a) => getStatus(a) === "Ended").length;
  let open = assessments.filter((a) => getStatus(a) === "Active").length;
  document.getElementById("totalAssessments").textContent = assessments.length;
  document.getElementById("gradedAssessments").textContent = graded;
  document.getElementById("openAssessments").textContent = open;
}

function renderTabs(assessments) {
  let assignments = assessments.filter((a) => a.type === "Assignment").length;
  let quizzes = assessments.filter((a) => a.type === "Quiz").length;
  let exams = assessments.filter((a) => a.type === "Exam").length;
  document.getElementById("allTab").textContent = `All (${assessments.length})`;
  document.getElementById("assignmentsTab").textContent =
    `Assignments (${assignments})`;
  document.getElementById("quizzesTab").textContent = `Quizzes (${quizzes})`;
  document.getElementById("examsTab").textContent = `Exams (${exams})`;
  setActiveTab("allTab", "All");
  setActiveTab("assignmentsTab", "Assignment");
  setActiveTab("quizzesTab", "Quiz");
  setActiveTab("examsTab", "Exam");
}

function setActiveTab(id, type) {
  document.getElementById(id).classList.toggle("active", currentType === type);
}

function filterByType(type) {
  currentType = type;
  tableBody.innerHTML = "";
  getAssessments();
}

function filterByCourse(course) {
  currentCourse = course;
  tableBody.innerHTML = "";
  getAssessments();
}

function getSelectedStudentIds() {
  return [
    ...document.querySelectorAll("#studentList .student-check:checked"),
  ].map((box) => box.value);
}

async function addAssessment(event) {
  event.preventDefault();
  try {
    let assessment = Object.fromEntries(new FormData(form));
    assessment.isDeleted = false;
    let course = courses.find((c) => c.name === assessment.course);
    if (!course) {
      throw new Error("Choose one of your courses");
    }
    assessment.courseId = course.id;
    assessment.studentIds = getSelectedStudentIds();
    if (assessment.studentIds.length === 0) {
      toast("Select at least one student", "error");
      return;
    }
    let response;
    if (editingId) {
      response = await fetch(`${Endpoint}/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assessment),
      });
    } else {
      assessment.instructorId = currentInstructor.id;
      response = await fetch(Endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assessment),
      });
    }
    if (!response.ok) {
      throw new Error("Failed to save assessment");
    }
    toast(editingId ? "Assessment updated" : "Assessment added");

    form.reset();
    tableBody.innerHTML = "";
    getAssessments();
    document.querySelector("#assessmentModal .btn-close").click();
  } catch (error) {
    console.log("Error:", error);
  }
}

form.addEventListener("submit", addAssessment);

document
  .getElementById("assessmentModal")
  .addEventListener("show.bs.modal", function () {
    let dueInput = document.getElementById("a-due");

    if (editingId === null) {
      assessmentsLink.classList.remove("active");
      newAssessmentLink.classList.add("active");
      bootstrap.Collapse.getOrCreateInstance(document.getElementById("shortcutsMenu"), { toggle: false }).show();
      dueInput.min = new Date().toLocaleDateString("en-CA");
    } else {
      dueInput.removeAttribute("min");
    }
  });

document
  .getElementById("assessmentModal")
  .addEventListener("hidden.bs.modal", function () {
    form.reset();
    document.querySelectorAll("#studentList input").forEach((box) => (box.checked = false));
    editingId = null;
    document.getElementById("assessmentTitle").textContent = "New assessment";
    newAssessmentLink.classList.remove("active");
    assessmentsLink.classList.add("active");
  });

async function updateAssessment(id) {
  try {
    let response = await fetch(`${Endpoint}/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch assessment");
    }
    let assessment = await response.json();
    editingId = id;
    document.getElementById("a-title").value = assessment.title;
    document.getElementById("a-type").value = assessment.type;
    document.getElementById("a-course").value = assessment.course;
    document.getElementById("a-due").value = assessment.dueDate;

    let boxes = [...document.querySelectorAll("#studentList .student-check")];
    boxes.forEach((box) => {
      box.checked = (assessment.studentIds || []).map(String).includes(box.value);
    });

    let all = document.getElementById("std-all");
    if (all) all.checked = boxes.length > 0 && boxes.every((box) => box.checked);

    updateStudentLabel();
    document.getElementById("assessmentTitle").textContent = "Edit assessment";
    bootstrap.Modal.getOrCreateInstance(
      document.getElementById("assessmentModal"),
    ).show();
  } catch (error) {
    console.log("Error:", error);
  }
}

async function deleteAssessment(id) {
  try {
    let response = await fetch(`${Endpoint}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isDeleted: true }),
    });
    if (!response.ok) {
      throw new Error("Failed to delete assessment");
    }
    toast("Assessment deleted");
    tableBody.innerHTML = "";
    getAssessments();
  } catch (error) {
    console.log("Error:", error);
  }
}

async function openDeleteModal(id) {
  deletingId = id;
  try {
    let response = await fetch(`${Endpoint}/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch assessment");
    }
    let assessment = await response.json();
    document.getElementById("deleteAssessmentName").textContent =
      assessment.title;
    bootstrap.Modal.getOrCreateInstance(
      document.getElementById("deleteModal"),
    ).show();
  } catch (error) {
    console.log("Error:", error);
  }
}

document
  .getElementById("confirmDeleteBtn")
  .addEventListener("click", function () {
    deleteAssessment(deletingId);
    document.getElementById("cancelDeleteBtn").click();
  });

function exportCsv() {
  let rows = [["Assessment", "Course", "Type", "Due", "Status"]];
  visibleAssessments.forEach((a) => {
    rows.push([a.title, a.course, a.type, a.dueDate, getStatus(a)]);
  });
  let csv = rows
    .map((row) =>
      row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","),
    )
    .join("\n");
  let blob = new Blob([csv], { type: "text/csv" });
  let link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "assessments.csv";
  link.click();
}

// Shortcut on this page: open the modal without reloading
newAssessmentLink.addEventListener("click", function (event) {
  event.preventDefault();
  bootstrap.Modal.getOrCreateInstance(
    document.getElementById("assessmentModal"),
  ).show();
});

if (new URLSearchParams(window.location.search).has("new")) {
  bootstrap.Modal.getOrCreateInstance(
    document.getElementById("assessmentModal"),
  ).show();
  history.replaceState(null, "", "assessments.html");
}

// Table buttons + tabs + export (replaces inline onclick in HTML and render)
tableBody.addEventListener("click", (event) => {
  let btn = event.target.closest("[data-action]");
  if (!btn) return;
  if (btn.dataset.action === "edit") updateAssessment(btn.dataset.id);
  if (btn.dataset.action === "delete") openDeleteModal(btn.dataset.id);
});

document.getElementById("allTab").addEventListener("click", () => filterByType("All"));
document.getElementById("assignmentsTab").addEventListener("click", () => filterByType("Assignment"));
document.getElementById("quizzesTab").addEventListener("click", () => filterByType("Quiz"));
document.getElementById("examsTab").addEventListener("click", () => filterByType("Exam"));
document.getElementById("exportCsvBtn").addEventListener("click", exportCsv);
document.getElementById("courseFilter").addEventListener("change", (e) => filterByCourse(e.target.value));

// Load the instructor's courses first so the dropdowns are filled
// before assessments are rendered or an edit tries to select a course.
async function init() {
  try {
    await loadCourses();
    await loadStudents();
  } catch (error) {
    console.log("Error:", error);
    return;
  }
  getAssessments();
}

init();