let Endpoint = "http://localhost:3000/students";
let studentContainer = document.getElementById("students-list");
let form = document.getElementById("studentForm");
let editingStudentId = null;
let submitStudentBtn = document.getElementById("submitStudentBtn");
let archivedInput = document.getElementById("status-archived");
let archivedLabel = document.querySelector('label[for="status-archived"]');
let addStudentBtn = document.getElementById("addStudentBtn");
let filterButtons = document.querySelectorAll("[data-filter]");
let currentFilter = "all";
let students = [];
let courseFilter = document.getElementById("courseFilter");
let exportBtn = document.getElementById("exportBtn");

// Hide Archived option 
function hideArchived() {
    archivedInput.hidden = true;
    archivedLabel.hidden = true;
    document.getElementById("status-active").checked = true;

}
// Show Archived option 
function showArchived() {
    archivedInput.hidden = false;
    archivedLabel.hidden = false;
}

// Add Student button
addStudentBtn.addEventListener("click", () => {
    editingStudentId = null;
    submitStudentBtn.textContent = "Add Student";
    hideArchived();
    form.reset();
    document.getElementById("status-active").checked = true;
});

// Get logged-in instructor
const readSession = (key) => {
    try {
        return JSON.parse(
            sessionStorage.getItem(key) ||
            localStorage.getItem(key) ||
            "null"
        );
    } catch {
        return null;
    }
};

const instructor = readSession("currentInstructor");

if (!instructor || !instructor.id) {
    location.href = "../index.html";
    throw new Error("No logged-in instructor");
}

const INSTRUCTORID = instructor.id;



// Render Student
function RenderStudent(student) {

    studentContainer.insertAdjacentHTML("afterbegin", `
        <tr>
            <td>
                <strong>${student.name}</strong>
                <small>${student.studentId}</small>
            </td>

            <td>${student.email}</td>

            <td>${student.phone || "N/A"}</td>

            <td>
                ${student.courses
            .map(course => `
                        <span class="course">
                            ${course.name}
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
                        onclick="updatestudent('${student.id}')">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>

                    <button
                        class="action-btn delete-btn"
                        title="Delete"
                        onclick="deletestudent('${student.id}')">
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


// POST / PUT
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

        // Convert courses input to objects
        student.courses = student.courses
            .split(",")
            .map(course => {

                let [name, grade] = course.split(":");

                return {
                    name: name.trim(),
                    grade: Number(grade)
                };

            })
            .filter(course => course.name && !isNaN(course.grade));


        let response;


        // UPDATE
        if (editingStudentId) {

            response = await fetch(
                `${Endpoint}/${editingStudentId}`,
                {
                    method: "PUT",
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

        // Change button text
        submitStudentBtn.textContent = "Update Student";


        // Put student data inside form
        document.getElementById("f-name").value =
            student.name;

        document.getElementById("f-code").value =
            student.studentId;

        document.getElementById("f-email").value =
            student.email;

        document.getElementById("f-phone").value =
            student.phone || "";


        // Convert courses objects back to text
        document.getElementById("f-courses").value =
            student.courses
                .map(course => `${course.name}:${course.grade}`)
                .join(", ");


        // Select status
        document.querySelector(
            `input[name="status"][value="${student.status}"]`
        ).checked = true;


        // Open modal
        let modal = new bootstrap.Modal(
            document.getElementById("studentModal")
        );

        modal.show();

    } catch (error) {

        console.log("Error:", error);

    }
}

getstudent();