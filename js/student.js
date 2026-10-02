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