const registerForm = document.getElementById("registerForm");
const registerNameInput = document.getElementById("registerName");
const registerEmailInput = document.getElementById("registerEmail");
const registerDepartmentInput = document.getElementById("registerDepartment");
const registerPhoneInput = document.getElementById("registerPhone");
const registerPasswordInput = document.getElementById("registerPassword");
const registerConfirmInput = document.getElementById("confirmPassword");
const registerError = document.getElementById("registerError");
const loginSection = document.getElementById("loginSection");
const registerSection = document.getElementById("registerSection");


// Open Register
document.getElementById("showRegister").addEventListener("click", function () {
  loginSection.classList.add("d-none");
  registerSection.classList.remove("d-none");
  registerError.textContent = "";
});


// Back to Login
document.getElementById("showLogin").addEventListener("click", function () {
  registerSection.classList.add("d-none");
  loginSection.classList.remove("d-none");
  registerError.textContent = "";
});


// Register
registerForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  registerError.textContent = "";

  const name = registerNameInput.value.trim();
  const email = registerEmailInput.value.trim();
  const department = registerDepartmentInput.value.trim();
  const phone = registerPhoneInput.value.trim();
  const password = registerPasswordInput.value.trim();
  const confirm = registerConfirmInput.value.trim();


  // Check passwords
  if (password !== confirm) {
    registerError.textContent = "Passwords do not match";
    return;
  }


  try {

    // Check email
    const checkResponse = await fetch(
      `http://localhost:3000/instructors?email=${encodeURIComponent(email)}`
    );

    if (!checkResponse.ok) {
      throw new Error("Server error");
    }

    const existing = await checkResponse.json();

    if (existing.length > 0) {
      registerError.textContent = "Email already exists";
      return;
    }


    // Get all instructors
    const allResponse = await fetch("http://localhost:3000/instructors");

    if (!allResponse.ok) {
      throw new Error("Failed to get instructors");
    }

    const allInstructors = await allResponse.json();


    // Create next numeric ID
    const numericIds = allInstructors
      .map(instructor => Number(instructor.id))
      .filter(id => !isNaN(id));

    const newId = numericIds.length > 0
      ? Math.max(...numericIds) + 1
      : 1;


    // New instructor
    const newInstructor = {
      id: String(newId),
      name,
      email,
      password,
      department,
      phone
    };


    // Add instructor
    const response = await fetch("http://localhost:3000/instructors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newInstructor)
    });


    if (!response.ok) {
      throw new Error("Failed to register");
    }


    alert("Account created successfully");

    registerForm.reset();

    // Return to Login
    registerSection.classList.add("d-none");
    loginSection.classList.remove("d-none");

  } catch (error) {
    console.error(error);
    registerError.textContent = "Cannot connect to server";
  }
});