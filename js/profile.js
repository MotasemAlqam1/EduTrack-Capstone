 let instructor = JSON.parse(
  sessionStorage.getItem("currentInstructor")
);

if (!instructor) {
  window.location.href = "../index.html";
}

const instructorName = document.getElementById("instructorName");
const topAvatar = document.getElementById("topAvatar");
const dropdownAvatar = document.getElementById("dropdownAvatar");
const profileAvatar = document.getElementById("profileAvatar");

const dropdownName = document.getElementById("dropdownName");
const dropdownDepartment = document.getElementById("dropdownDepartment");
const dropdownEmail = document.getElementById("dropdownEmail");

const profileForm = document.getElementById("profileForm");

const nameInput = document.getElementById("p-name");
const departmentInput = document.getElementById("p-dept");
const phoneInput = document.getElementById("p-phone");
const emailInput = document.getElementById("p-email");


function getInitials(name) {
  const words = name.split(" ");

  return (
    words[0][0] +
    (words[1] ? words[1][0] : "")
  ).toUpperCase();
}


function showData() {
  const initials = getInitials(instructor.name);

  instructorName.textContent = instructor.name;

  topAvatar.textContent = initials;
  dropdownAvatar.textContent = initials;
  profileAvatar.textContent = initials;

  dropdownName.textContent = instructor.name;
  dropdownDepartment.textContent = instructor.department || "";
  dropdownEmail.textContent = instructor.email;

  nameInput.value = instructor.name;
  departmentInput.value = instructor.department || "";
  phoneInput.value = instructor.phone || "";
  emailInput.value = instructor.email;
}


showData();


profileForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const updatedData = {
    name: nameInput.value.trim(),
    department: departmentInput.value.trim(),
    phone: phoneInput.value.trim()
  };

  const response = await fetch(
    `http://localhost:3000/instructors/${instructor.id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedData)
    }
  );

  instructor = await response.json();

  sessionStorage.setItem(
    "currentInstructor",
    JSON.stringify(instructor)
  );

  showData();

  alert("Profile updated successfully");
});


function logout() {
  sessionStorage.removeItem("currentInstructor");
  window.location.href = "../index.html";
}


document
  .getElementById("logoutBtn")
  .addEventListener("click", logout);

document
  .getElementById("sidebarLogout")
  .addEventListener("click", logout);