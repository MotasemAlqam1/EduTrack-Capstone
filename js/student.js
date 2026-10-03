let Endpoint = "http://localhost:3000/students";
let studentContainer = document.getElementById("students-list");
let form = document.getElementById("studentForm");
let editingStudentId = null;
let submitStudentBtn = document.getElementById("submitStudentBtn");


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
                    .map(course => `<span class="badge rounded-pill course-pill">${course.name}</span>`)
                    .join("")}
            </td>
            <td>
                <span class="badge ${student.status === "active" ? "bg-success" : "bg-secondary"}">
                    ${student.status === "active" ? "Active" : "Archived"}
                </span>
            </td>
            <td class="text-end">
                <button class="btn btn-sm btn-light" title="Edit" onclick="updatestudent('${student.id}')">
                    <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-sm btn-light text-danger" title="Delete" onclick="openDeleteModal('${student.id}')">
                    <i class="bi bi-trash3"></i>
                </button>
            </td>
        </tr>
    `);
}


// GET
async function getstudent() {

    try {

        let response = await fetch(Endpoint);

        if (!response.ok) {
            throw new Error("Failed to fetch Students");
        }

        let data = await response.json();

        data
            .filter(student => !student.isDeleted)
            .forEach(student => RenderStudent(student));

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

        student.isDeleted = false;


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
        submitStudentBtn.textContent = "Save student";

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
        document.getElementById("f-status").value = student.status;


        // Open modal
        let modal = bootstrap.Modal.getOrCreateInstance(
            document.getElementById("studentModal")
        );

        modal.show();

    } catch (error) {

        console.log("Error:", error);

    }
}


getstudent();


// Reset form when modal closes
document
    .getElementById("studentModal")
    .addEventListener("hidden.bs.modal", function () {
        form.reset();
        editingStudentId = null;
        document.getElementById("studentTitle").textContent = "New student";
        submitStudentBtn.textContent = "Save student";
        document.getElementById("newStudentLink").classList.remove("active");
        document.getElementById("studentsLink").classList.add("active");
    });


// Delete confirmation
let deletingId = null;

async function openDeleteModal(id) {
    deletingId = id;
    try {
        let response = await fetch(`${Endpoint}/${id}`);
        if (!response.ok) {
            throw new Error("Failed to fetch student");
        }
        let student = await response.json();
        document.getElementById("deleteStudentName").textContent = student.name;
        bootstrap.Modal.getOrCreateInstance(
            document.getElementById("deleteModal")
        ).show();
    } catch (error) {
        console.log("Error:", error);
    }
}

document
    .getElementById("confirmDeleteBtn")
    .addEventListener("click", function () {
        deletestudent(deletingId);
        document.getElementById("cancelDeleteBtn").click();
    });


// Light up "Add student" while the modal is open for a new student
document
    .getElementById("studentModal")
    .addEventListener("show.bs.modal", function () {
        if (editingStudentId === null) {
            document.getElementById("studentsLink").classList.remove("active");
            document.getElementById("newStudentLink").classList.add("active");
            bootstrap.Collapse.getOrCreateInstance(document.getElementById("shortcutsMenu"), { toggle: false }).show();
        }
    });


// Shortcut on this page: open the modal without reloading
document
    .getElementById("newStudentLink")
    .addEventListener("click", function (event) {
        event.preventDefault();
        bootstrap.Modal.getOrCreateInstance(
            document.getElementById("studentModal")
        ).show();
    });


// Open the modal when coming from another page (students.html?new=true)
if (new URLSearchParams(window.location.search).has("new")) {
    bootstrap.Modal.getOrCreateInstance(
        document.getElementById("studentModal")
    ).show();
    history.replaceState(null, "", "students.html");
}
