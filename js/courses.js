const API_URL = "http://localhost:3000/courses";


// ==================================================
// DOM ELEMENTS
// ==================================================

const coursesContainer =
    document.getElementById("coursesContainer");

const noCoursesMessage =
    document.getElementById("noCoursesMessage");

const courseFormContainer =
    document.getElementById("courseFormContainer");

const courseModal =
    new bootstrap.Modal(courseFormContainer);

const courseForm =
    document.getElementById("courseForm");

const addCourseBtn =
    document.getElementById("addCourseBtn");

const cancelCourseBtn =
    document.getElementById("cancelCourseBtn");

const submitCourseBtn =
    document.getElementById("submitCourseBtn");

const courseFormTitle =
    document.getElementById("courseFormTitle");

const courseName =
    document.getElementById("courseName");

const courseDescription =
    document.getElementById("courseDescription");

const courseCategory =
    document.getElementById("courseCategory");

const searchInput =
    document.getElementById("searchInput");


// ==================================================
// STATE
// ==================================================

// null = Add Mode
// Course ID = Edit Mode

let editingCourseId = null;


// All courses from API

let allCourses = [];


// ==================================================
// SHOW ADD FORM
// ==================================================

addCourseBtn.addEventListener("click", function () {

    editingCourseId = null;

    courseForm.reset();

    courseFormTitle.textContent =
        "Add Course";

    submitCourseBtn.textContent =
        "Add Course";

    courseModal.show();

    courseName.focus();

});


// ==================================================
// CANCEL
// ==================================================

courseFormContainer.addEventListener(
    "hidden.bs.modal",
    function () {

        editingCourseId = null;

        courseForm.reset();

        courseFormTitle.textContent =
            "Add Course";

        submitCourseBtn.textContent =
            "Add Course";

        document.getElementById("newCourseLink").classList.remove("active");
        document.getElementById("coursesLink").classList.add("active");

    }
);


// ==================================================
// RENDER COURSES
// ==================================================

function renderCourses(courses) {

    // Clear old cards

    coursesContainer.innerHTML = "";


    // No courses

    if (courses.length === 0) {

        noCoursesMessage.style.display =
            "block";

        return;

    }


    noCoursesMessage.style.display =
        "none";


    // Loop through courses

    courses.forEach(function (course) {


        // ==================================================
        // COLUMN
        // ==================================================

        const column =
            document.createElement("div");

        column.classList.add(
            "col-12",
            "col-md-6",
            "col-xl-4"
        );


        // ==================================================
        // CARD
        // ==================================================

        const card =
            document.createElement("div");

        card.classList.add(
            "course-card"
        );


        // ==================================================
        // TITLE
        // ==================================================

        const title =
            document.createElement("h3");

        title.classList.add(
            "course-card-title"
        );

        title.textContent =
            course.name;


        // ==================================================
        // DESCRIPTION
        // ==================================================

        const description =
            document.createElement("p");

        description.classList.add(
            "course-card-description"
        );

        description.textContent =
            course.description;


        // ==================================================
        // CATEGORY
        // ==================================================

        const category =
            document.createElement("span");

        category.classList.add(
            "course-category"
        );

        category.textContent =
            course.category;


        // ==================================================
        // ACTIONS
        // ==================================================

        const actions =
            document.createElement("div");

        actions.classList.add(
            "course-actions"
        );


        // ==================================================
        // EDIT BUTTON
        // ==================================================

        const editButton =
            document.createElement("button");

        editButton.type = "button";

        editButton.textContent =
            "Edit";

        editButton.classList.add(
            "btn",
            "btn-sm",
            "btn-outline-success"
        );


        // ==================================================
        // DELETE BUTTON
        // ==================================================

        const deleteButton =
            document.createElement("button");

        deleteButton.type = "button";

        deleteButton.textContent =
            "Delete";

        deleteButton.classList.add(
            "btn",
            "btn-sm",
            "btn-outline-danger"
        );


        // ==================================================
        // ADD BUTTONS TO ACTIONS
        // ==================================================

        actions.appendChild(editButton);

        actions.appendChild(deleteButton);


        // ==================================================
        // ADD ELEMENTS TO CARD
        // ==================================================

        card.appendChild(title);

        card.appendChild(description);

        card.appendChild(category);

        card.appendChild(actions);


        // ==================================================
        // ADD CARD TO COLUMN
        // ==================================================

        column.appendChild(card);


        // ==================================================
        // ADD COLUMN TO CONTAINER
        // ==================================================

        coursesContainer.appendChild(column);


        // ==================================================
        // EDIT EVENT
        // ==================================================

        editButton.addEventListener(
            "click",
            function () {

                editingCourseId =
                    course.id;


                courseName.value =
                    course.name;

                courseDescription.value =
                    course.description;

                courseCategory.value =
                    course.category;


                courseFormTitle.textContent =
                    "Edit Course";

                submitCourseBtn.textContent =
                    "Update Course";


                courseModal.show();


                courseName.focus();

            }
        );


        // ==================================================
        // DELETE EVENT
        // ==================================================

        deleteButton.addEventListener(
            "click",
            async function () {

                const confirmed =
                    confirm(
                        `Are you sure you want to delete "${course.name}"?`
                    );


                if (!confirmed) {

                    return;

                }


                try {

                    const response =
                        await fetch(
                            `${API_URL}/${course.id}`,
                            {
                                method: "DELETE"
                            }
                        );


                    if (!response.ok) {

                        throw new Error(
                            "Failed to delete course"
                        );

                    }


                    await getCourses();

                }
                catch (error) {

                    console.error(
                        "Delete error:",
                        error
                    );

                    alert(
                        "Failed to delete course"
                    );

                }

            }
        );

    });

}


// ==================================================
// GET COURSES
// ==================================================

async function getCourses() {

    try {

        const response =
            await fetch(API_URL);


        if (!response.ok) {

            throw new Error(
                "Failed to fetch courses"
            );

        }


        const courses =
            await response.json();


        // Save API data

        allCourses = courses;


        // Display courses

        renderCourses(
            allCourses
        );

    }
    catch (error) {

        console.error(
            "Get courses error:",
            error
        );

        alert(
            "Failed to load courses"
        );

    }

}


// ==================================================
// SEARCH
// ==================================================

searchInput.addEventListener(
    "input",
    function () {

        const searchValue =
            searchInput.value
                .toLowerCase()
                .trim();


        const filteredCourses =
            allCourses.filter(
                function (course) {

                    return course.name
                        .toLowerCase()
                        .includes(searchValue);

                }
            );


        renderCourses(
            filteredCourses
        );

    }
);


// ==================================================
// FORM SUBMIT
// ==================================================

courseForm.addEventListener(
    "submit",
    async function (event) {

        // Prevent page reload

        event.preventDefault();


        // ==================================================
        // GET USER INPUT
        // ==================================================

        const newCourse = {

            name:
                courseName.value.trim(),

            description:
                courseDescription.value.trim(),

            category:
                courseCategory.value.trim(),

            instructorId:
                "INS001"

        };


        // ==================================================
        // VALIDATION
        // ==================================================

        if (
            newCourse.name === "" ||
            newCourse.description === "" ||
            newCourse.category === ""
        ) {

            alert(
                "Please fill all fields"
            );

            return;

        }


        // ==================================================
        // PATCH - UPDATE
        // ==================================================

        if (editingCourseId) {

            try {

                const response =
                    await fetch(
                        `${API_URL}/${editingCourseId}`,
                        {

                            method: "PATCH",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    newCourse
                                )

                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "Failed to update course"
                    );

                }


                editingCourseId = null;


                await getCourses();


                courseForm.reset();


                courseModal.hide();


                courseFormTitle.textContent =
                    "Add Course";

                submitCourseBtn.textContent =
                    "Add Course";

            }
            catch (error) {

                console.error(
                    "Update error:",
                    error
                );

                alert(
                    "Failed to update course"
                );

            }


            return;

        }


        // ==================================================
        // POST - ADD
        // ==================================================

        try {

            const response =
                await fetch(
                    API_URL,
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                newCourse
                            )

                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Failed to add course"
                );

            }


            await getCourses();


            courseForm.reset();


            courseModal.hide();


            courseFormTitle.textContent =
                "Add Course";

            submitCourseBtn.textContent =
                "Add Course";

        }
        catch (error) {

            console.error(
                "Add course error:",
                error
            );

            alert(
                "Failed to add course"
            );

        }

    }
);


// ==================================================
// INITIAL LOAD
// ==================================================

getCourses();


// ==================================================
// SHORTCUT: ADD COURSE
// ==================================================

// Light up "Add course" while the modal is open for a new course
courseFormContainer.addEventListener("show.bs.modal", function () {
    if (editingCourseId === null) {
        document.getElementById("coursesLink").classList.remove("active");
        document.getElementById("newCourseLink").classList.add("active");
        bootstrap.Collapse.getOrCreateInstance(document.getElementById("shortcutsMenu"), { toggle: false }).show();
    }
});


// Shortcut on this page: open the modal without reloading
document
    .getElementById("newCourseLink")
    .addEventListener("click", function (event) {
        event.preventDefault();
        addCourseBtn.click();
    });


// Open the modal when coming from another page (courses.html?new=true)
if (new URLSearchParams(window.location.search).has("new")) {
    addCourseBtn.click();
    history.replaceState(null, "", "courses.html");
}
