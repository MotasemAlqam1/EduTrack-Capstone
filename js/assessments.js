let Endpoint = "http://localhost:3000/assessments";
let tableBody = document.getElementById("assessmentsTableBody");
let form = document.getElementById("assessmentForm");
let deletingId = null;
let editingId = null;
let currentType = "All";
let currentCourse = "All courses";
let visibleAssessments = [];
 
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
 
async function getAssessments() {
  try {
    let response = await fetch(Endpoint);
    if (!response.ok) {
      throw new Error("Failed to fetch Assessments");
    }
    let data = await response.json();
        let currentInstructor = JSON.parse(
      sessionStorage.getItem("currentInstructor"),
    );
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
      <td>${assessment.title}</td>
      <td>${assessment.course}</td>
      <td><span class="badge rounded-pill ${typeClasses[assessment.type]}">${assessment.type}</span></td>
      <td>${assessment.dueDate}</td>
      <td><span class="badge ${statusClasses[status]}">${status}</span></td>
      <td class="text-end">
        <button class="btn btn-sm btn-light" title="Edit" onclick="updateAssessment('${assessment.id}')">
          <i class="bi bi-pencil-square"></i>
        </button>
        <button class="btn btn-sm btn-light text-danger" title="Delete" onclick="openDeleteModal('${assessment.id}')">
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
 
async function addAssessment(event) {
  event.preventDefault();
  try {
    let assessment = Object.fromEntries(new FormData(form));
    assessment.isDeleted = false;
    let response;
    if (editingId) {
      response = await fetch(`${Endpoint}/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assessment),
      });
    } else {
      let currentInstructor = JSON.parse(
        sessionStorage.getItem("currentInstructor"),
      );
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
 
getAssessments();