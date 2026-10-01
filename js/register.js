const registerForm = document.getElementById("registerForm");

const nameInput = document.getElementById("registerName");
const emailInput = document.getElementById("registerEmail");
const departmentInput = document.getElementById("registerDepartment");
const phoneInput = document.getElementById("registerPhone");
const passwordInput = document.getElementById("registerPassword");
const confirmInput = document.getElementById("confirmPassword");

const registerError = document.getElementById("registerError");

const loginSection = document.getElementById("loginSection");
const registerSection = document.getElementById("registerSection");

document.getElementById("showRegister").addEventListener("click", function () {
  loginSection.classList.add("d-none");
  registerSection.classList.remove("d-none");
});

document.getElementById("showLogin").addEventListener("click", function () {
  registerSection.classList.add("d-none");
  loginSection.classList.remove("d-none");
});

registerForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const department = departmentInput.value.trim();
  const phone = phoneInput.value.trim();
  const password = passwordInput.value.trim();
  const confirm = confirmInput.value.trim();

  if (password !== confirm) {
    registerError.textContent = "Passwords do not match";
    return;
  }

  const checkResponse = await fetch(
    `http://localhost:3000/instructors?email=${email}`
  );

  const existing = await checkResponse.json();

  if (existing.length > 0) {
    registerError.textContent = "Email already exists";
    return;
  }

  const response = await fetch(
    "http://localhost:3000/instructors"
  );

  const instructors = await response.json();

  let instructorId = 1;

  if (instructors.length > 0) {
    instructorId = instructors.length + 1;
  }

  const newInstructor = {
    instructorId,
    name,
    email,
    password,
    department,
    phone
  };

  await fetch(
    "http://localhost:3000/instructors",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newInstructor)
    }
  );

  alert("Account created successfully");

  registerForm.reset();

  registerSection.classList.add("d-none");
  loginSection.classList.remove("d-none");
});