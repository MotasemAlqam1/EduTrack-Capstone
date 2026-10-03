const registerForm =
  document.getElementById("registerForm");

const registerNameInput =
  document.getElementById("registerName");

const registerEmailInput =
  document.getElementById("registerEmail");

const registerDepartmentInput =
  document.getElementById("registerDepartment");

const registerPhoneInput =
  document.getElementById("registerPhone");

const registerPasswordInput =
  document.getElementById("registerPassword");

const registerConfirmInput =
  document.getElementById("confirmPassword");

const registerError =
  document.getElementById("registerError");

const loginSection =
  document.getElementById("loginSection");

const registerSection =
  document.getElementById("registerSection");

const phoneRegisterError =
  document.getElementById("phoneRegisterError");

const emailRegisterError =
  document.getElementById("emailRegisterError");

const confirmRegisterError =
  document.getElementById("confirmRegisterError");

const ruleLower =
  document.getElementById("ruleLower");

const ruleUpper =
  document.getElementById("ruleUpper");

const ruleNumber =
  document.getElementById("ruleNumber");

const ruleSpecial =
  document.getElementById("ruleSpecial");

const ruleLength =
  document.getElementById("ruleLength");


function updateRule(element, isValid) {

  const icon =
    element.querySelector("i");

  if (isValid) {

    icon.className =
      "bi bi-check-circle-fill";

    element.classList.add("rule-valid");

    element.classList.remove("rule-invalid");

  } else {

    icon.className =
      "bi bi-x-circle-fill";

    element.classList.add("rule-invalid");

    element.classList.remove("rule-valid");
  }
}


registerPasswordInput.addEventListener(
  "input",
  function () {

    const password =
      registerPasswordInput.value;


    const hasLower =
      /[a-z]/.test(password);

    const hasUpper =
      /[A-Z]/.test(password);

    const hasNumber =
      /[0-9]/.test(password);

    const hasSpecial =
      /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const hasLength =
      password.length >= 6;


    updateRule(
      ruleLower,
      hasLower
    );

    updateRule(
      ruleUpper,
      hasUpper
    );

    updateRule(
      ruleNumber,
      hasNumber
    );

    updateRule(
      ruleSpecial,
      hasSpecial
    );

    updateRule(
      ruleLength,
      hasLength
    );
  }
);

// ================================
// Open Register
// ================================

document
  .getElementById("showRegister")
  .addEventListener("click", function () {

    loginSection.classList.add("d-none");

    registerSection.classList.remove(
      "d-none"
    );

    registerError.textContent = "";
  });


// ================================
// Back To Login
// ================================

document
  .getElementById("showLogin")
  .addEventListener("click", function () {

    registerSection.classList.add(
      "d-none"
    );

    loginSection.classList.remove(
      "d-none"
    );

    registerError.textContent = "";
  });


// ================================
// Phone Validation
// ================================

function isValidPhone(phone) {

  phone =
    phone
      .trim()
      .replace(/[\s-]/g, "");


  const localPhone =
    /^07[789]\d{7}$/;


  const internationalPhone =
    /^\+9627[789]\d{7}$/;


  return (
    localPhone.test(phone) ||
    internationalPhone.test(phone)
  );
}


// ================================
// Email Validation
// ================================

function isValidEmail(email) {

  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailPattern.test(email);
}


// ================================
// Password Validation
// ================================

function isValidPassword(password) {

  return (
    password.length >= 6 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password)
  );
}


// ================================
// Live Phone Validation
// ================================

registerPhoneInput.addEventListener(
  "input",
  function () {

    const phone =
      registerPhoneInput.value.trim();


    if (phone === "") {

      phoneRegisterError.textContent = "";

      return;
    }


    if (isValidPhone(phone)) {

      phoneRegisterError.textContent =
        "Valid phone number";

      phoneRegisterError.style.color =
        "green";

    } else {

      phoneRegisterError.textContent =
        "Please enter a valid Jordanian phone number";

      phoneRegisterError.style.color =
        "red";
    }

  }
);


// ================================
// Live Email Validation
// ================================

 registerEmailInput.addEventListener("input", function () {
  const email = registerEmailInput.value.trim();

  if (email === "") {
    emailRegisterError.textContent = "";
    return;
  }

  if (isValidEmail(email)) {
    emailRegisterError.textContent = "";
  } else {
    emailRegisterError.textContent =
      "Please enter a valid email";

    emailRegisterError.style.color = "red";
  }
});


// ================================
// Live Password Validation
// ================================

 

// ================================
// Confirm Password Live Validation
// ================================

registerConfirmInput.addEventListener(
  "input",
  function () {

    const password =
      registerPasswordInput.value;

    const confirm =
      registerConfirmInput.value;


    if (confirm === "") {

      confirmRegisterError.textContent =
        "";

      return;
    }


    if (password === confirm) {

      confirmRegisterError.textContent =
        "Passwords match";

      confirmRegisterError.style.color =
        "green";

    } else {

      confirmRegisterError.textContent =
        "Passwords do not match";

      confirmRegisterError.style.color =
        "red";
    }

  }
);


// ================================
// Register
// ================================

registerForm.addEventListener(
  "submit",
  async function (event) {

    event.preventDefault();


    registerError.textContent = "";


    const name =
      registerNameInput.value.trim();

    const email =
      registerEmailInput.value.trim();

    const department =
      registerDepartmentInput.value.trim();

    const phone =
      registerPhoneInput.value
        .trim()
        .replace(/[\s-]/g, "");

    const password =
      registerPasswordInput.value;

    const confirm =
      registerConfirmInput.value;


    // =========================
    // Phone Check
    // =========================

    if (!isValidPhone(phone)) {

      phoneRegisterError.textContent =
        "Use 077, 078, 079 or +962";

      phoneRegisterError.style.color =
        "red";

      return;
    }


    // =========================
    // Email Check
    // =========================

    if (!isValidEmail(email)) {

      emailRegisterError.textContent =
        "Please enter a valid email";

      emailRegisterError.style.color =
        "red";

      return;
    }


    // =========================
    // Password Check
    // =========================
if (!isValidPassword(password)) {
  return;
}


    // =========================
    // Confirm Password
    // =========================

    if (password !== confirm) {

      confirmRegisterError.textContent =
        "Passwords do not match";

      confirmRegisterError.style.color =
        "red";

      return;
    }


    try {

      // =========================
      // Check Existing Email
      // =========================

      const checkResponse =
        await fetch(
          `http://localhost:3000/instructors?email=${encodeURIComponent(email)}`
        );


      if (!checkResponse.ok) {

        throw new Error(
          "Server error"
        );
      }


      const existing =
        await checkResponse.json();


      if (existing.length > 0) {

        emailRegisterError.textContent =
          "Email already exists";

        emailRegisterError.style.color =
          "red";

        return;
      }


      // =========================
      // Get All Instructors
      // =========================

      const allResponse =
        await fetch(
          "http://localhost:3000/instructors"
        );


      if (!allResponse.ok) {

        throw new Error(
          "Failed to get instructors"
        );
      }


      const allInstructors =
        await allResponse.json();


      // =========================
      // Create New ID
      // =========================

      const numericIds =
        allInstructors
          .map(function (instructor) {

            return Number(
              instructor.id
            );

          })
          .filter(function (id) {

            return !isNaN(id);

          });


      const newId =
        numericIds.length > 0
          ? Math.max(...numericIds) + 1
          : 1;


      // =========================
      // New Instructor
      // =========================

      const newInstructor = {

        id: String(newId),

        name: name,

        email: email,

        password: password,

        department: department,

        phone: phone

      };


      // =========================
      // POST
      // =========================

      const response =
        await fetch(
          "http://localhost:3000/instructors",
          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json"

            },

            body:
              JSON.stringify(
                newInstructor
              )

          }
        );


      if (!response.ok) {

        throw new Error(
          "Failed to register"
        );
      }


      // =========================
      // Get Created Instructor
      // =========================

      const createdInstructor =
        await response.json();


      // =========================
      // Login Directly
      // =========================

      sessionStorage.setItem(
        "currentInstructor",
        JSON.stringify(
          createdInstructor
        )
      );


      // =========================
      // Go Directly Dashboard
      // =========================

      window.location.href =
        "pages/dashboard.html";


    } catch (error) {

      console.error(error);

      registerError.textContent =
        "Cannot connect to server";
    }

  }
);